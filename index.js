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
                const { expression } = value;

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
        const [observed, attributes] = Object.entries(props).reduce(
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
            style,
            ...rest
          } = attributes;

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
              ...["style"].map((identifier) =>
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
            [
              t.Identifier("name"),
              t.Identifier("oldValue"),
              t.Identifier("newValue"),
            ],
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
                  [t.Identifier("oldValue"), t.Identifier("newValue")]
                )
              ),
            ])
          );

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
              t.CallExpression(
                t.MemberExpression(
                  t.Identifier("customElements"),
                  t.Identifier("define")
                ),
                [t.StringLiteral(elementName.toLowerCase()), ClassExpression]
              )
            )
          );
        } else {
          // console.log(path.node.children);
        }

        // const wrapper = t.ClassDeclaration();

        //     types: 'function classDeclaration(id, superClass, body, decorators) {\n' +
        // '  return _builder.default.apply("ClassDeclaration", arguments);\n' +
        // '}'

        // //get the opening element from jsxElement node
        // var openingElement = path.node.openingElement;
        // //tagname is name of tag like div, p etc
        // var tagName = openingElement.name.name;
        // // arguments for React.createElement function
        // var args = [];
        // //adds "div" or any tag as a string as one of the argument
        // args.push(t.stringLiteral(tagName));
        // // as we are considering props as null for now
        // var attribs = t.nullLiteral();
        // //push props or other attributes which is null for now
        // args.push(attribs);
        // // order in AST Top to bottom -> (CallExpression => MemberExpression => Identifiers)
        // // below are the steps to create a callExpression
        // var reactIdentifier = t.identifier("React"); //object
        // var createElementIdentifier = t.identifier("createElement"); //property of object
        // var callee = t.memberExpression(
        //   reactIdentifier,
        //   createElementIdentifier
        // );
        // var callExpression = t.callExpression(callee, args);
        // //now add children as a third argument
        // callExpression.arguments = callExpression.arguments.concat(
        //   path.node.children
        // );
        // // replace jsxElement node with the call expression node made above

        // path.replaceWith(callExpression, path.node);
      },
    },
  };
};
