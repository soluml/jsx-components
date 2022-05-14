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

  return {
    name: "jsx-components",
    manipulateOptions(opts, parserOpts) {
      parserOpts.plugins.push("jsx");
    },
    visitor: {
      JSXText(path) {
        // if the child of JSX Element is normal string
        const stringChild = t.stringLiteral(path.node.value);

        path.replaceWith(stringChild, path.node);
      },
      JSXElement(path) {
        const openingElement = path.node.openingElement;
        const elementName = openingElement.name.name;
        const tagName = elementName.toLowerCase();

        if (!elementName.includes("-")) {
          throw new Error(
            `
            Custom Element names must contain a dash (https://html.spec.whatwg.org/#valid-custom-element-name)
            
            Got: "${elementName}"
            `
          );
        }

        const isWrappingElement = path.parentPath.type !== "JSXElement";
        const props = openingElement.attributes.reduce(
          (acc, { name, value }) => {
            function getValue() {
              if (value?.type === "JSXExpressionContainer") {
                let { expression } = value;
                const { code } = generator(expression);

                if (typeof eval(code) === "function") {
                  expression = parseExpression(`${code}.bind(shadow)`);
                }

                return expression;
              }

              return value?.value ?? true;
            }

            return {
              ...acc,
              [name.name]: getValue(),
            };
          },
          {}
        );
        let [observed, attributes] = Object.entries(props).reduce(
          (acc, [name, value]) => {
            acc[+(typeof value !== "object")][name.toLowerCase()] = value;

            return acc;
          },
          [{}, {}]
        );

        if (isWrappingElement) {
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
            (olink
              ? [eval(generator(olink).code)].flat(Infinity)
              : undefined) ||
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

          const constructor = t.ClassMethod(
            "constructor",
            t.Identifier("constructor"),
            [],
            t.BlockStatement([
              // super()
              t.ExpressionStatement(
                t.CallExpression(t.identifier("super"), [])
              ),
              // const shadow = this.attachShadow
              constFactory(
                "shadow",
                [t.ThisExpression(), t.Identifier("attachShadow")],
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
                      t.Identifier("shadow"),
                      t.Identifier("appendChild")
                    ),
                    [t.Identifier(identifier)]
                  )
                )
              ),
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
                  t.ObjectProperty(
                    t.Identifier("extends"),
                    t.StringLiteral(ex)
                  ),
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
        } else {
          // console.log(path.node.children);
        }
      },
    },
  };
};
