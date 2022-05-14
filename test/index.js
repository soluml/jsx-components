export const OpenButton = (
  <Cmpt-OpenButton
    link={["button.css", "dialog.css"]}
    open={(oldValue, newValue) =>
      console.log("open", { oldValue, newValue }, this)
    }
    disabled={function (oldValue, newValue) {
      console.log("disabled", { oldValue, newValue }, this);
    }}
  >
    <div>
      <p>Hello World</p>
    </div>
  </Cmpt-OpenButton>
);

const slotName = "subject";
const defaultSubject = "World";

export const MyParagraph = (
  <Cmpt-My-Paragraph style="aasda" link={"p.css"} extends="p">
    Hello <slot name={slotName}>{defaultSubject}</slot>!
  </Cmpt-My-Paragraph>
);
