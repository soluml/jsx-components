export default (
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
