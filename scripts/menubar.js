var isMenubarOpen = false
var isShareIconsVisible = false

function closeMenubar() {
  $("#open-menu-blocker").fadeOut(215)
  $("#menu").css("left", "-300px")
  $("#header").css("left", "0px").removeClass("menubarIsOpen")
  isMenubarOpen = false
}

function openMenubar() {
  $("#open-menu-blocker").fadeIn(215)
  $("#menu").css("left", "0px")
  $("#header").css("left", "300px").addClass("menubarIsOpen")
  isMenubarOpen = true
}

function toggleMenubar() {
  if (isMenubarOpen) {
    closeMenubar()
  } else {
    openMenubar()
  }
}

function toggleShareIcons() {
  if (!isShareIconsVisible) {
    $("#share-popout").fadeIn(215)
  } else {
    $("#share-popout").fadeOut(215)
  }
  isShareIconsVisible = !isShareIconsVisible
}