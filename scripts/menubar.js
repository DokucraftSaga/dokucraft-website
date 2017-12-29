var isShareIconsVisible = false

function toggleShareIcons() {
  if (!isShareIconsVisible) {
    $("#share-popout").fadeIn(215)
  } else {
    $("#share-popout").fadeOut(215)
  }
  isShareIconsVisible = !isShareIconsVisible
}