$(document).ready(function () {
  var emojiStandAlone = $("#emoji").emojioneArea({
    standalone: true,
    autocomplete: false,
    events: {},
  });

  const emojionearea = emojiStandAlone[0].emojioneArea;

  emojionearea.on("picker.hide", function () {
    const emoji = emojionearea.getText();
    emojionearea.setText("");
    if (emoji) {
      $("#msg").val(function (i, val) {
        return val + `${emoji}`;
      });
    }
  });
});
