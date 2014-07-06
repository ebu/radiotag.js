test("The object radiotag exists", function() {
  ok(radiotag);
});

test("The protocol calls are present", function() {
  ok(radiotag.tag);
  ok(radiotag.listTags);
});
