/**
 * Summernote video popover
 * https://github.com/li-st/summernote-video-popover
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('jquery'));
    } else {
        factory(window.jQuery);
    }
}(function ($) {
    var _sn_default_popover = $.summernote.options.popover;
    if (!_sn_default_popover) {
        _sn_default_popover = {};
    }
    _sn_default_popover.video = [
        ['videosize', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']],
        ['float', ['floatLeft', 'floatRight', 'floatNone']],
        ['remove', ['removeVideo']]
    ];
    $.extend($.summernote.options, {
        popover: _sn_default_popover
    });
    $.extend($.summernote.plugins, {
        videoPopover: function (context) {
            var self = this;
            var ui = $.summernote.ui;
            var options = context.options;

            var $note = context.layoutInfo.note;
            var $editable = context.layoutInfo.editable;
            var lang = options.langInfo;

            var hasTarget = function (e, tagName, only_first) {
                var ret = [];
                do {
                    if (!e) {
                        break;
                    }
                    $editable.find(tagName).each(function () {
                        var bound = $(this).offset();
                        if (e.pageX < bound.left || e.pageY < bound.top || e.pageX > bound.left + $(this).width() || e.pageY > bound.top + $(this).height()) {
                            return true;
                        }
                        ret.push(this);
                        if (only_first) {
                            return false;
                        }
                    });
                } while (false);

                return ret;
            };

            // Remove Buttons
            context.memo('button.removeVideo', function () {
                return ui.button({
                    contents: ui.icon(options.icons.trash),
                    tooltip: lang.videoPopover.remove,
                    click: context.createInvokeHandler('editor.removeMedia')
                }).render();
            });

            this.shouldInitialize = function () {
                return options.popover.video && options.popover.video.length;
            };

            this.initialize = function () {
                $note.on('summernote.keyup summernote.scroll summernote.change summernote.dialog.shown', function () {
                    self.hide();
                });
                $note.on('summernote.disable summernote.blur', function () {
                    self.hide();
                });
                $editable.on('mousedown', function (e) {
                    var targets = hasTarget(e, 'video', true);
                    if (targets.length) {
                        context.invoke('videoPopover.update', targets[0], e);
                    } else {
                        self.hide();
                    }
                });

                this.$popover = ui.popover({
                    className: 'note-image-popover'
                }).render().appendTo(options.container);
                var $content = this.$popover.find('.popover-content,.note-popover-content');
                context.invoke('buttons.build', $content, options.popover.video);
                this.$popover.on('mousedown', function (e) {
                    e.preventDefault();
                });
            };

            this.destroy = function () {
                this.$popover.remove();
            };

            this.update = function (target, event) {
                if (target) {
                    var $selection = context.modules.handle.$handle.find('.note-control-selection');
                    var $target = $(target);
                    var target_pos = $target.position();
                    var targetSize = {
                        w: $target.outerWidth(true),
                        h: $target.outerHeight(true)
                    };
                    $selection.css({
                        display: 'block',
                        left: target_pos.left,
                        top: target_pos.top,
                        width: targetSize.w,
                        height: targetSize.h
                    }).data('target', $target); // save current image element.
                    var sizingText = targetSize.w + 'x' + targetSize.h;
                    $selection.find('.note-control-selection-info').text(sizingText);

                    context.invoke('editor.saveTarget', target);

                    var position = $(target).offset();
                    var containerOffset = $(options.container).offset();
                    let pos = {};
                    if (options.popatmouse) {
                        pos.left = event.pageX - 20;
                        pos.top = event.pageY;
                    } else {
                        pos = position;
                    }
                    pos.top -= containerOffset.top;
                    pos.left -= containerOffset.left;

                    this.$popover.css({
                        display: 'block',
                        left: pos.left,
                        top: pos.top
                    });
                    return true;
                } else {
                    this.hide();
                    return false;
                }
            };

            this.hide = function () {
                this.$popover.hide();
            };
        }
    });
    $.extend(true, $.summernote.lang, {
        'en-US': {/* English */
            videoPopover: {
                remove: 'Remove Video'
            }
        }
    });
}));