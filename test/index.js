export default (
  <Wrapper
    style="asda"
    onOpen={(...rest) => console.log("open", { rest })}
    open={false}
    disabled
  >
    <div>
      <p>Hello World</p>
    </div>
  </Wrapper>
);
