import $ from 'jquery'

class ListComponents extends window.HTMLDivElement {
  constructor (self) {
    self = super(self)
    self.$ = $(self)
    self.resolveElements()
    return self
  }

  resolveElements () {
    this.animating = []
    this.$componentImageWrappers = $('.component-previewImage', this)
  }

  connectedCallback () {
    this.$.on('mouseover', this.$componentImageWrappers.selector, this.startPreviewScroll.bind(this))
    this.$.on('mouseout', this.$componentImageWrappers.selector, this.stopPreviewScroll.bind(this))
  }

  startPreviewScroll (e) {
    let $imageWrapper = $(e.currentTarget)
    let $image = $imageWrapper.find('.image')
    if ($image.height() > $imageWrapper.height()) {
      $image.css('transition', 'transform ' + 0.01 * ($image.height() - $imageWrapper.height()) + 's cubic-bezier(0.215, 0.61, 0.355, 1)')
      $image.css('transform', 'translateY(-' + ($image.height() - $imageWrapper.height()) + 'px)')
    }
  }

  stopPreviewScroll (e) {
    let $imageWrapper = $(e.currentTarget)
    let $image = $imageWrapper.find('.image')
    if ($image.height() > $imageWrapper.height()) {
      $image.css('transition', 'transform ' + 0.01 * ($image.height() - $imageWrapper.height()) + 's cubic-bezier(0.23, 1, 0.32, 1)')
      $image.css('transform', 'translateY(0)')
    }
  }
}

window.customElements.define('flynt-list-components', ListComponents, {extends: 'div'})
