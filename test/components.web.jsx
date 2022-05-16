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
    <button type="button" onClick={() => console.log("Open Dialog")}>
      Open Dialog
    </button>
    <dialog />
  </Cmpt-OpenButton>
);

const slotName = "subject";
const defaultSubject = "World";

export const MyParagraph = (
  <Cmpt-My-Paragraph style="aasda" link={"p.css"} extends="p">
    Hello <slot name={slotName}>{defaultSubject}</slot>!
  </Cmpt-My-Paragraph>
);
