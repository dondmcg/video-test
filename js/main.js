window.$ = window.jQuery = require('jquery')
require('../node_modules/bootstrap/dist/js/bootstrap')

var mediaFrag = ( function() {
    var video, sources, play_buttons, delete_buttons, edit_buttons;
    video = document.querySelector('video#frag1');
    sources = video.getElementsByTagName('source');
    play_buttons = document.querySelectorAll('#playlist .row.fragment .glyphicon-play');
    delete_buttons = document.querySelectorAll('#playlist .row.fragment .glyphicon-remove');
    edit_buttons = document.querySelectorAll('#playlist .row.fragment .glyphicon-pencil');
    fragments = document.querySelectorAll('#playlist .row.fragment');
    
    // method to set up play buttons
    var setPlayButtons = function(i) {
        $('.fragment').on('click', '.glyphicon-play', function() {
            for (var i = sources.length - 1; i >= 0; i--) {
                sources[i].setAttribute(
                    'src', (sources[i].getAttribute('data-original')
                    .concat('#t=' + this.getAttribute('data-start') + ',' + this.getAttribute('data-end') )));
                    video.load();
                    video.play();
            };
        });
    }
    
    // method to set up edit buttons
    var setEditButtons = function(i) {
        //reset the number of edit buttons as one was added
        edit_buttons = document.querySelectorAll('#playlist .row.fragment .glyphicon-pencil');
        // set up edit buttons
        edit_buttons[i].addEventListener('click', function() {
            var editStatus = $(this).hasClass('editing');
            var thisRow = $(this).closest('.row');
            var self = $(this);
            if ( !editStatus ) {
                self.addClass('editing');
                var title = thisRow.find('.frag-title').text(),
                start = thisRow.find('.frag-start').text(),
                end = thisRow.find('.frag-end').text();
                thisRow.find('.frag-title').html('<input type="text" value="' + title + '" class="form-control" />');
                thisRow.find('.frag-start').html('<input type="text" value="' + start+ '" class="form-control" />');
                thisRow.find('.frag-end').html('<input type="text" value="' + end + '" class="form-control" />');
            } else {
                self.removeClass('editing');
                var title = thisRow.find('.frag-title input').val(),
                start = thisRow.find('.frag-start input').val(),
                end = thisRow.find('.frag-end input').val();
                thisRow.find('.frag-title').html( title );
                thisRow.find('.frag-start').html( start );
                thisRow.find('.frag-end').html( end );
                thisRow.find('.glyphicon-play').attr( 'data-start', start );
            }
            // toggle the button pencil icon and bg
            thisRow.find('[class^="col-"]:nth-child(3),[class*="col-"]:nth-child(3)').toggleClass('bg-primary brand-success');
            self.toggleClass('glyphicon-pencil glyphicon-ok');
        });
    };
    
    for (var i = fragments.length - 1; i >= 0; i--) {
        // set up play buttons
        setPlayButtons(i);
        // handle closure
        (function(){
            if( i < fragments.length - 1 ){
                // set up edit buttons
                setEditButtons(i);
            }
        })(i);
    }
    // set up adding of fragments
    document.getElementById('add_frag').addEventListener('click', function(e) {
        var $Form = $('#add_frag_form');
        var isValid = $Form[0].checkValidity();
        if (isValid === false) {
          // If the form is invalid, submit it. The form won't actually submit;
          $Form.submit();
          return;
        }
        e.preventDefault();
        var jsForm = document.getElementById('add_frag_form'),
        title = jsForm.elements[0].value,
        start = jsForm.elements[1].value,
        end = jsForm.elements[2].value,
        fragments = document.querySelectorAll('#playlist .row.fragment'),
        fragNum = fragments.length,
        newRow = '<div class="row fragment">\n<div class="col-sm-1 bg-lt-grey"><span data-start="' + start + '" data-end="' + end + '" class="glyphicon glyphicon-play"></span></div>' +
            '<div class="col-sm-9">' +
            '<form name="row1" id="row1">\n<div class="form-group">\n<div class="row"><div class="col-md-6">' +
            '<span class="frag-title">' + title + '</span>' +
            '</div><div class="col-md-6"><small>' + 
            '<span class="frag-start">' + start + '</span> - <span class="frag-end">' + end + '</span>' +
            '</small></div></div></div></form></div>' +
            '<div class="col-sm-1 bg-primary"><span class="glyphicon glyphicon-pencil"></span></div>' +
            '<div class="col-sm-1 bg-delete"><span class="delete glyphicon glyphicon-remove" data-toggle="modal" data-target="#confirm-delete" data-row="' + fragNum + '" data-frag-title="' + title + ' ' + start + ' - ' + end + '"></span>' +
            '</div>\n</div>';
        if( title && start && end ){
            $('#playlist').append( newRow );
            //jsForm.reset();
            $('.slider').toggleClass('closed');
        }
        setPlayButtons(fragNum - 1);
        setEditButtons(fragNum - 1);
    });
})();

// on load functions
window.onload = function() {
    $('body').removeClass('loading').addClass('loaded');
    // add click for "add fragment" slider
    $('#add_frag_btn').on('click', function(){
        $('.slider').toggleClass('closed');
    });
    
    // pass data to confirm delete modal
    $('#confirm-delete').on('show.bs.modal', function(e) {
        $(this).find('.btn-ok').attr('data-row', $(e.relatedTarget).data('row'));
        $(this).find('.modal-header .frag-title').html( $(e.relatedTarget).data('frag-title') );
    });
    // handle delete of row here
    $('#confirm-delete .btn-ok').on('click', function() {
        var fragments = document.querySelectorAll('.container#playlist .row.fragment');
  	var rowNum = $(this).attr('data-row');
  	fragments[rowNum].remove();
  	$('#confirm-delete').modal('hide');
    });
    // clear modal of passed data
    $('#confirm-delete').on('hide.bs.modal', function(e) {
        $(this).find('.modal-header .frag-title').html( '' );
    });
}

(function ($) {

        $('video').on('loadstart', function (event) {
                $(this).attr("poster", "images/loading.gif");
            });
            // remove loading image from player on video load
            $('video').on('canplay', function (event) {
                $(this).removeAttr("poster");
        });
            
}(jQuery));
