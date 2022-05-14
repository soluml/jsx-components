export const Test = (
  <Cmpt-Wrapper
    style="aasda"
    link={["reset.css", "cmpt.css"]}
    open={(oldValue, newValue) => console.log("open", { oldValue, newValue })}
  >
    <div>
      <p>Hello World</p>
    </div>
  </Cmpt-Wrapper>
);

export const Test2 = (
  <Cmpt-Global link={"cmpt.css"} extends="p">
    Hello <slot name="attributes">World</slot>
  </Cmpt-Global>
);
