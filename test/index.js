export default (
  <Cmpt-Wrapper
    style="aasda"
    link={["google.css", "google1.css"]}
    open={(oldValue, newValue) => console.log("open", { oldValue, newValue })}
  >
    <div>
      <p>Hello World</p>
    </div>
  </Cmpt-Wrapper>
);
