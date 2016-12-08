/* globals wpData */
import 'file-loader?name=vendor/draggabilly.js!draggabilly/dist/draggabilly.pkgd'
const $ = jQuery
// admin
if ($('body.wp-admin').length) {
  // show module preview images
  $('body').on('mouseenter', 'a[data-layout]', function (e) {
    const $target = $(e.currentTarget)
    const layout = $target.data('layout')
    return showAddModulePreview(layout, $target.closest('.acf-fc-popup'))
  })

  // hide preview images
  $('body').on('mouseleave', 'a[data-layout]', function (e) {
    const $target = $(e.currentTarget)
    return hideAddModulePreview($target.closest('.acf-fc-popup'))
  })

  var showAddModulePreview = function (layout, $wrapper) {
    const moduleName = firstToUpperCase(layout)
    const image = {
      desktop: wpData.templateDirectoryUri + '/Modules/' + moduleName + '/preview-desktop.jpg',
      mobile: wpData.templateDirectoryUri + '/Modules/' + moduleName + '/preview-mobile.jpg'
    }
    const $wrapperContainer = $("<div class='add-module-preview-image-wrapper'>").appendTo($wrapper)
    $.ajax({
      url: image.desktop
    }).done(function () {
      $wrapperContainer.append(`<img class='add-module-preview-image add-module-preview-image-desktop' src='${image.desktop}'>`)
    })
    $.ajax({
      url: image.mobile
    }).done(function () {
      $wrapperContainer.append(`<img class='add-module-preview-image add-module-preview-image-mobile' src='${image.mobile}'>`)
    })
  }

  let hideAddModulePreview = $wrapper => {
    $wrapper.find('.add-module-preview-image-wrapper')
    .remove()
  }

  // collapse modules
  $('body')
  .on('click', '.acf-label .collapse-all, .acf-th-flexible_content .collapse-all', e =>
    $(e.currentTarget)
    .closest('.acf-field')
    .closestChild('.values')
    .children('.layout:not(.-collapsed)')
    .children('.acf-fc-layout-controlls')
    .find('[data-event="collapse-layout"]')
    .click()
  )
  // expand modules
  .on('click', '.acf-label .expand-all, .acf-th-flexible_content .expand-all', e =>
    $(e.currentTarget)
    .closest('.acf-field')
    .closestChild('.values')
    .children('.layout.-collapsed')
    .children('.acf-fc-layout-controlls')
    .find('[data-event="collapse-layout"]')
    .click()
  )
} else if ($('html.logged-in').length) {
  // front-end logged in
  let $mpc = null
  let $activeImage = []

  $('body')
  .on('click', '#wp-admin-bar-toggleModulePreviews', function (e) {
    e.preventDefault()
    const $target = $(e.currentTarget)
    $target.toggleClass('active')
    if ($target.hasClass('active')) {
      return showImages()
    } else {
      return hideImages()
    }
  })

  let showImages = function () {
    if (($mpc = $('#module-preview-container')).length) {
      $mpc.show()
    } else {
      $mpc = $('<div id="module-preview-container"></div>').appendTo('body')
      getModuleImages()
      initModulePreviewsDragEvents()
    }
    return $(window).on('keydown.moveModulePreviewImage', moveModulePreviewImage)
  }

  let hideImages = function () {
    $mpc.hide()
    return $(window).off('keydown.moveModulePreviewImage')
  }

  let getModuleImages = function (output = {}) {
    $('.main-content [is]').each(function () {
      const moduleString = $(this).attr('is')
      let moduleName = $.camelCase(moduleString.substring(moduleString.indexOf('-') + 1))
      moduleName = firstToUpperCase(moduleName)
      const images = {
        desktop: wpData.templateDirectoryUri + '/Modules/' + moduleName + '/preview-desktop.jpg',
        mobile: wpData.templateDirectoryUri + '/Modules/' + moduleName + '/preview-mobile.jpg'
      }
      if (output[moduleName] == null) { output[moduleName] = images }
      addModulePreviews($(this), images)
    })
    return output
  }

  let addModulePreviews = function ($module, images) {
    const offset = $module.offset()
    const desktopImage = `<img class='module-preview-image module-preview-image-desktop' src='${images.desktop}'>`
    appendImage(desktopImage, offset, $module)
    const mobileImage = `<img class='module-preview-image module-preview-image-mobile' src='${images.mobile}'>`
    appendImage(mobileImage, offset, $module)
  }

  let appendImage = function (image, offset, $module) {
    const $image = $(image)
    return $image
    .appendTo($mpc)
    .css({
      opacity: 0.7,
      position: 'absolute',
      zIndex: 9999,
      top: offset.top,
      left: offset.left
    })
    .data('module', $module)
    .on('error', function () {
      $image.remove()
    })
  }

  let initModulePreviewsDragEvents = function () {
    const $images = $('.module-preview-image')
    return $images.each(function () {
      const $draggable = $(this).draggabilly()
      $draggable.on('dragStart', function () {
        let maxZIndex = 0
        $images.each(function () {
          let zIndex = parseInt($(this).css('zIndex'), 10)
          if (zIndex > maxZIndex) { maxZIndex = zIndex }
        })
        $activeImage = $(this)
        return $activeImage.css('zIndex', maxZIndex + 1)
      })
    })
  }

  let moveModulePreviewImage = function (e) {
    e.preventDefault()
    const imageLeft = parseInt($activeImage.css('left'), 10)
    const imageTop = parseInt($activeImage.css('top'), 10)
    switch (e.which) {
      case 38: // up
        return $activeImage.css('top', imageTop - 1)
      case 39: // right
        return $activeImage.css('left', imageLeft + 1)
      case 40: // down
        return $activeImage.css('top', imageTop + 1)
      case 37: // left
        return $activeImage.css('left', imageLeft - 1)
    }
  }

  let repositionModulePreviewImages = function () {
    const $images = $('.module-preview-image')
    return $images.each(function () {
      const $module = $(this).data('module')
      return $(this).css('top', $module.offset().top)
    })
  }

  $(window).on('resize', repositionModulePreviewImages)
}

let firstToUpperCase = function (str) {
  return str.substr(0, 1).toUpperCase() + str.substr(1)
}

$.fn.closestChild = function (selector) {
  let $children
  let $results
  $children = this.children()
  if ($children.length === 0) {
    return $()
  }
  $results = $children.filter(selector)
  if ($results.length > 0) {
    return $results
  } else {
    return $children.closestChild(selector)
  }
}
