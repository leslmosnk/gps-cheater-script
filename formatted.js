// 
// Formatted version of the code
// 

// insert created by banner
$('.cover_header').css({'height': 'auto'});
$('.magazine_page_largetitle2')
.css({'font-size': '35px', 'font-weight': 'bold', 'background': 'white', 'padding': '25px', 'border-bottom': 'red solid 5px'})
.html(`
    <span style="color: red;">Sander Cheat</span><br><br>
    Gemaakt door <a href="https://sanderbrilman.nl" target="_blank" style="text-decoration: underline;">Sander Brilman</a><br>
    <a href="https://sanderbrilman.nl/sander-cheat/" target="_blank" style="text-decoration: underline;">- Website</a><br>
    <a href="https://github.com/Sander-Brilman/sander-cheat" target="_blank" style="text-decoration: underline;">- Github repo</a><br>
`);

    // function for clicking the Check & Next button
    const checkAndNext = function() {
        $('#btn_controleer').removeAttr('disabled');
        $('#btn_controleer').removeAttr('disabled');
        setTimeout($('#btn_controleer').click(), 1000);
        setTimeout($('#btn_volgende').click(), 1000);
    }

const failSafe = function() {
    if (document.getElementsByClassName('rradio').length != 0) { //radio excer
        var innerText = document.getElementById('gfeedback').innerText;
        var choises = document.getElementsByClassName('optionbox');
        for (let i = 1; i <= choises.length; i++) {
            var box = document.getElementById('box' + i.toString()).querySelector('input');
            console.log(box)
            if (innerText.includes('Answer ' + String.fromCharCode(i + 64))) {
                box.click();
            }
        }
        document.getElementById('btn_controleer').removeAttribute('disabled');
        setTimeout(document.getElementById('btn_controleer').click(), 1000);
        setTimeout(document.getElementById('btn_volgende').click(), 1000);
        return;
    }
    
    if (document.getElementsByClassName('ch_label').length != 0) {// checkboxes
        var innerText = document.getElementById('gfeedback').innerText;
        var choises = document.getElementsByClassName('optionbox');
        for (let i = 1; i <= choises.length; i++) {
            var box = document.getElementById('box' + i.toString());
            if (innerText.slice(0, 50).includes(' ' + String.fromCharCode(i + 64))) {
                box.click();
            }
        }
        document.getElementById('btn_controleer').removeAttribute('disabled');
        setTimeout(document.getElementById('btn_controleer').click(), 1000);
        setTimeout(document.getElementById('btn_volgende').click(), 1000);
        return;
    }
    
    let url = window.location.pathname.split('/');
    let key = `${url[3]}-${url[4]}-${url[5]}-${$('#pw_id').val()}`;
    
    if (localStorage.getItem(key) != null) {
        console.log('e');
        let answers = JSON.parse(localStorage.getItem(key));
    
        if ($('.answer30').length > 0)// input fiels
        {
            let i = 1;
            $('.answer30').each(function() {
                $(this).val(answers[i][0])
                i++;
            });
            checkAndNext();
            return;
        }
    
        if ($(".ui-draggable").length > 0) {
            send_answer($('#pw_id').val(), answers.join('+'));
            checkAndNext();
            return;
        }

        if ($('.optionbox').length > 0) {
            send_answer($('#pw_id').val(), answers.join('+'));
            checkAndNext();
            return;
        }

        if ($(".rmarked").length > 0) {
            send_answer($('#pw_id').val(), answers.join('+'));
            checkAndNext();
            return;
        }
    
    
    } else {
        $('#btn_volgende').click(function() {
            localStorage.setItem(key, send_answer());
        })
    }

    $('.magazine_page_largetitle2').html(`
    <span style="color: red">Kan opdracht niet oplossen maak het handmatig</span><br><br>
    <small>Alle antwoorden worden bij de <u>Volgende keer</u> 100% ingevuld.</small><br>
    <small style="font-size: 18px">
        Gemaakt door <a href="https://sanderbrilman.nl" target="_blank" style="text-decoration: underline;">Sander Brilman</a> - 
        <a href="https://sanderbrilman.nl/sander-cheat/" target="_blank" style="text-decoration: underline;">Cheat website</a> - 
        <a href="https://github.com/Sander-Brilman/sander-cheat" target="_blank" style="text-decoration: underline;">Github repo</a>
    </small>`);

    $('#gfeedback').fadeIn();
}

let answers;

const getAnswers = function() {
    let answer;
    let url = window.location.pathname.split('/');
    $.ajax({
        type: 'POST',
        url: '/werkvormen/answer.php',
        async: false,
        data: {
            'lid': url[3],
            'mid': url[4],
            'pid': url[5],
            'pwid': $('#pw_id').val(),
        },
        context: document.body,
        success: function(data) {
            try {
                console.log(data);
                answer = JSON.parse(data);
            } catch(e) {
                console.log('failsafe');
                failSafe();
                answer = null;
            }
        },
    });
    return answer;
}



if ($('#istoets').val() == 1) {
    // 
    // toets script
    // 

    answers = getAnswers();

    console.log('andwerls', answers);

    if (answers != null) {
        if (typeof answers[0] !== 'string' && !(answers[0] instanceof String)) {
            // 
            // exceptions where a different answer format is required
            // 
        
            if (!isNaN(answers)) {// radio buttons
        
                $(`#box${answers} .rradio`).click();
                $('#btn_controleer').click();
        
            } else if ($('.answer30').length > 0) {// text fields
        
                // get the first valid answer for each text field & enter that as value. The checkbox will send the answers to the server for us :)
                $.each($('.answer30'), function(p) {
                    $(this).val(answers[$(this).attr('id').replace('qu', '')][0]);
                });
        
            } else {// in case of unknown situation: show feedback allowing the person to solve it themselves
                $('.magazine_page_largetitle2').css('color', 'red').html('Automatisch beantwoorden mislukt.<br><br>Kijk in de console voor de antwoorden en voer ze handmatig in.');
                console.log('antwoorden: ', answers);
                $('#gfeedback').fadeIn();
            }
        
        } else {
            // send the correct answers back to the server
            send_answer($('#pw_id').val(), answers.join('+'));
        }

        $('#btn_volgende').removeAttr('disabled');
        setTimeout($('#btn_volgende').click(), 1000);
    }

} else {
    // 
    // opdrachten script
    // 

    // variable deflations
    let executeScript   = true;



    // press exit on the last page
    if ($('a[data-page-id="end"]').length > 0) {
        setTimeout(window.open($('a[data-page-id="end"]').attr('href'), '_self'), 2000);
        executeScript = false;
    }

    // press next on any non-exercise pages
    if ($('.cover_header_startbtn').length > 0) {
        window.open($('.cover_header_startbtn').attr('href'), '_self');
        executeScript = false;
    }

    // press next on exercise pages that are already answered
    let nextButton = $('#btn_volgende');
    if (($('h5').length != 1 || $('h5').text() != 'Instructions') ||
        (!nextButton.attr('disabled') !== 'undefined' && !nextButton.attr('disabled') !== false)) 
    {
        nextButton.click();
        executeScript = false;
    }

    // get & send the answers if no button has been pressed yet
    if (executeScript) {

        answers = getAnswers();
        
        if (answers != null) {
            if (typeof answers[0] !== 'string' && !(answers[0] instanceof String)) {
                // 
                // exceptions where a different answer format is required
                // 
            
                if (!isNaN(answers)) {// radio buttons
            
                    $(`#box${answers} .rradio`).click();
                    $('#btn_controleer').click();
            
                } else if ($('.answer30').length > 0) {// text fields
            
                    // get the first valid answer for each text field & enter that as value. The checkbox will send the answers to the server for us :)
                    $.each($('.answer30'), function(p) {
                        $(this).val(answers[$(this).attr('id').replace('qu', '')][0]);
                    });
            
                } else {// in case of unknown situation: show feedback allowing the person to solve it themselves
                    $('.magazine_page_largetitle2').css('color', 'red').html('Automatisch beantwoorden mislukt.<br><br>Kijk in de console voor de antwoorden en voer ze handmatig in.');
                    console.log('antwoorden: ', answers);
                    $('#gfeedback').fadeIn();
                }
            
            } else {
                // send the correct answers back to the server
                send_answer($('#pw_id').val(), answers.join('+'));
            }
    
            // check answers & go to next question
            checkAndNext();
        }
    }
}
