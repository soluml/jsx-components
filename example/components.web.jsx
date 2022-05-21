import paragraphCSS from "paragraph.raw.css!=!./paragraph.css";
import buttonCSS from "button.file.css!=!./button.css";
import dialogCSS from "dialog.file.css!=!./dialog.css";

console.log({ buttonCSS, dialogCSS, paragraphCSS });

export const OpenButton = (
  <Cmpt-OpenButton
    link={["buttonCSS", "dialogCSS"]}
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
  <Cmpt-My-Paragraph style={paragraphCSS}>
    Hello <slot name={slotName}>{defaultSubject}</slot>!
  </Cmpt-My-Paragraph>
);
