const { default: generator } = require("@babel/generator");
const { parseExpression } = require("@babel/parser");

module.exports = function (babel) {
  const t = babel.types;

  const constFactory = function (identifier, memberExpression, arguments) {
    return t.VariableDeclaration("const", [
      t.VariableDeclarator(
        t.Identifier(identifier),
        t.CallExpression(t.MemberExpression(...memberExpression), [
          ...arguments,
        ])
      ),
    ]);
  };

  function handleJSXText(node, varName) {
    const { start, end, value } = node;
    const textName = "text" + start + end;

    const arr = [
      constFactory(
        textName,
        [t.Identifier("document"), t.Identifier("createTextNode")],
        [t.StringLiteral(value)]
      ),
    ];

    arr.push(
      varName
        ? t.ExpressionStatement(
            t.CallExpression(
              t.MemberExpression(
                t.Identifier(varName),
                t.Identifier("appendChild")
              ),
              [t.identifier(textName)]
            )
          )
        : t.ExpressionStatement(
            t.CallExpression(
              t.MemberExpression(
                t.MemberExpression(t.ThisExpression(), t.Identifier("shadow")),
                t.Identifier("appendChild")
              ),
              [t.identifier(textName)]
            )
          )
    );

    return arr;
  }

  function handleJSXElement(node, skipProcessing) {
    const { openingElement } = node;
    let { children } = node;
    const elementName = openingElement.name.name;
    const props = openingElement.attributes.reduce((acc, { name, value }) => {
      function getValue() {
        if (value?.type === "JSXExpressionContainer") {
          let { expression } = value;
          const { code } = generator(expression);

          if (eval(`typeof (${code})`) === "function") {
            expression = parseExpression(`${code}.bind(this.shadow)`);
          }

          return expression;
        }

        return value?.value ?? true;
      }

      return {
        ...acc,
        [name.name]: getValue(),
      };
    }, {});
    const [observed, attributes] = Object.entries(props).reduce(
      (acc, [name, value]) => {
        acc[+(typeof value !== "object")][name.toLowerCase()] = value;

        return acc;
      },
      [{}, {}]
    );

    if (children.length) {
      children = children.map((node) => {
        switch (node.type) {
          case "JSXText":
            return handleJSXText(
              node,
              !skipProcessing && elementName + node.start + node.end
            );
          case "JSXElement":
            return handleJSXElement(node);
          default:
            throw new Error("Unaccounted for type: " + node.type);
        }
      });
    }

    if (skipProcessing) {
      return {
        openingElement,
        children,
        elementName,
        observed,
        attributes,
      };
    } else {
      console.log("");
    }
  }

  const obj = {
    name: "jsx-components",
    manipulateOptions(opts, parserOpts) {
      parserOpts.plugins.push("jsx");
    },
    visitor: {
      JSXText(path) {
        path.replaceWith(t.stringLiteral(path.node.value), path.node);
      },
      JSXElement(path) {
        const nodeProps = handleJSXElement(path.node, true);

        const { openingElement, children, elementName } = nodeProps;
        let { observed, attributes } = nodeProps;
        const tagName = elementName.toLowerCase();

        if (!elementName.includes("-")) {
          throw new Error(
            `
            Custom Element names must contain a dash (https://html.spec.whatwg.org/#valid-custom-element-name)
            
            Got: "${elementName}"
            `
          );
        }

        const {
          mode = "open",
          delegatesFocus = true,
          extends: ex,
          style,
          link: alink,
          ..._ra
        } = attributes;
        const { link: olink, ..._ro } = observed;

        attributes = _ra;
        observed = _ro;
        link =
          (alink ? [alink] : undefined) ||
          (olink ? [eval(generator(olink).code)].flat(Infinity) : undefined) ||
          [];

        const observedAttributes = t.ClassMethod(
          "get",
          t.Identifier("observedAttributes"),
          [],
          t.BlockStatement([
            t.ReturnStatement(
              t.ArrayExpression(
                Object.keys(observed).map((n) => t.stringLiteral(n))
              )
            ),
          ]),
          false,
          true
        );

        console.log("=========================");
        console.log(JSON.stringify(children.flat(Infinity), null, 2));
        console.log("=========================");

        const constructor = t.ClassMethod(
          "constructor",
          t.Identifier("constructor"),
          [],
          t.BlockStatement([
            // super()
            t.ExpressionStatement(t.CallExpression(t.identifier("super"), [])),
            // this.shadow = this.attachShadow
            t.ExpressionStatement(
              t.AssignmentExpression(
                "=",
                t.MemberExpression(t.ThisExpression(), t.Identifier("shadow")),
                t.CallExpression(
                  t.MemberExpression(
                    t.ThisExpression(),
                    t.Identifier("attachShadow")
                  ),
                  [
                    t.ObjectExpression([
                      t.ObjectProperty(
                        t.Identifier("mode"),
                        t.stringLiteral(mode)
                      ),
                      t.ObjectProperty(
                        t.Identifier("delegatesFocus"),
                        t.BooleanLiteral(delegatesFocus)
                      ),
                    ]),
                  ]
                )
              )
            ),
            // const link = document.createElement('link')
            ...(link
              ? [
                  ...link
                    .map((l, i) => {
                      const key = "link" + i;

                      return [
                        constFactory(
                          key,
                          [
                            t.Identifier("document"),
                            t.Identifier("createElement"),
                          ],
                          [t.stringLiteral("link")]
                        ),
                        t.ExpressionStatement(
                          t.AssignmentExpression(
                            "=",
                            t.MemberExpression(
                              t.Identifier(key),
                              t.Identifier("rel")
                            ),
                            t.stringLiteral("stylesheet")
                          )
                        ),
                        t.ExpressionStatement(
                          t.AssignmentExpression(
                            "=",
                            t.MemberExpression(
                              t.Identifier(key),
                              t.Identifier("href")
                            ),
                            t.stringLiteral(l)
                          )
                        ),
                      ];
                    })
                    .flat(Infinity),
                ]
              : []),
            ...(style
              ? [
                  // const style = document.createElement('style')
                  constFactory(
                    "style",
                    [t.Identifier("document"), t.Identifier("createElement")],
                    [t.stringLiteral("style")]
                  ),
                  // style.textContent = `style`;
                  t.ExpressionStatement(
                    t.AssignmentExpression(
                      "=",
                      t.MemberExpression(
                        t.Identifier("style"),
                        t.Identifier("textContent")
                      ),
                      t.stringLiteral(style)
                    )
                  ),
                ]
              : []),
            //
            // this.attributes = { ... }
            t.ExpressionStatement(
              t.AssignmentExpression(
                "=",
                t.MemberExpression(
                  t.ThisExpression(),
                  t.Identifier("attributes")
                ),
                t.ObjectExpression(
                  Object.entries(observed).map(([key, expression]) =>
                    t.ObjectProperty(t.Identifier(key), expression)
                  )
                )
              )
            ),
            // shadow.append()
            ...[
              ...link.map((_, i) => "link" + i), // If we have link's
              ...(style ? ["style"] : []), // If we have style
            ].map((identifier) =>
              t.ExpressionStatement(
                t.CallExpression(
                  t.MemberExpression(
                    t.MemberExpression(
                      t.ThisExpression(),
                      t.Identifier("shadow")
                    ),
                    t.Identifier("appendChild")
                  ),
                  [t.Identifier(identifier)]
                )
              )
            ),
            // rest append()
            ...children.flat(Infinity).filter((n) => n), //TODO: remove filter once done
          ])
        );

        const attributeChangedCallback = t.ClassMethod(
          "method",
          t.Identifier("attributeChangedCallback"),
          [t.Identifier("name"), t.RestElement(t.Identifier("rest"))],
          t.BlockStatement([
            t.ExpressionStatement(
              t.CallExpression(
                t.MemberExpression(
                  t.MemberExpression(
                    t.ThisExpression(),
                    t.Identifier("attributes")
                  ),
                  t.Identifier("name"),
                  true
                ),
                [t.SpreadElement(t.Identifier("rest"))]
              )
            ),
          ])
        );

        const extension = ex
          ? [
              t.ObjectExpression([
                t.ObjectProperty(t.Identifier("extends"), t.StringLiteral(ex)),
              ]),
            ]
          : [];

        const ClassExpression = t.ClassExpression(
          t.Identifier(elementName.replace("-", "")),
          t.Identifier("HTMLElement"),
          t.ClassBody([
            observedAttributes,
            constructor,
            attributeChangedCallback,
          ])
        );

        path.replaceWith(
          t.ExpressionStatement(
            t.LogicalExpression(
              "||",
              t.CallExpression(
                t.MemberExpression(
                  t.Identifier("customElements"),
                  t.Identifier("define")
                ),
                [t.StringLiteral(tagName), ClassExpression, ...extension]
              ),
              t.StringLiteral(tagName)
            )
          )
        );
      },
    },
  };

  return obj;
};
