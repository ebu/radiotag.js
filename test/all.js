describe("The radiotag object", function() {
  it("should exist", function() {
    expect(radiotag).to.be.ok;
  });

  it("should contain protocol calls", function() {
    expect(radiotag.tag).to.be.a("function");
    expect(radiotag.listTags).to.be.a("function");
  });

  it("should contain utils functions", function() {
    expect(radiotag.utils.getUri).to.be.a("function");
    expect(radiotag.utils.getDomain).to.be.a("function");
  });
});
