var DragAndDrop = {};

DragAndDrop.isSupported = function() {
  return window.FileReader ? true : false;
}

DragAndDrop.addDropTarget = function(target, onDrop) {
  target.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
  })
  .on('dragover dragenter', function() {
    target.addClass('dnd-dragover');
  })
  .on('dragleave dragend drop', function() {
    target.removeClass('dnd-dragover');
  })
  .on('drop', function(e) {
    onDrop(e.originalEvent.dataTransfer.files);
  });
}

DragAndDrop.createBrowseButton = function(button, fileinput, onChange) {
  fileinput.on("change", function() {
    if (fileinput[0].files) onChange(fileinput[0].files);
  });

  button.on("click", function() {
      fileinput.trigger("click");
  });
}