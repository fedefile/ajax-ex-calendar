$(document).ready(function () {

    var htmlGiorno = $('#calendar-template').html();
    var templateGiorno = Handlebars.compile(htmlGiorno);

    // Stampare il mese di Gennaio 2018
    // Tramite click stampare il mese successivo

    var dataIniziale = moment('2018-01-01');

    var limiteIniziale = moment('2018-01-01');
    var limiteFinale = moment('2018-12-31');

    stampaGiorniMese(dataIniziale); // Inizializzazione Calendario
    stampaFestivi(dataIniziale);

    $('.mese-succ').click(function () { // Mese successivo
        $('.mese-prec').prop('disabled', false);
        dataIniziale.add(1, 'month');
        stampaGiorniMese(dataIniziale);
        stampaFestivi(dataIniziale);
    });

    // Devo controllare che il mese
    $('.mese-prec').click(function () { // Mese precedente
         if(dataIniziale.isSameOrBefore(limiteIniziale)){
              alert('Hai provato ad hackerarmi! :( ');
         } else {
             dataIniziale.subtract(1, 'month');
             stampaGiorniMese(dataIniziale);
             stampaFestivi(dataIniziale);
             if(dataIniziale.isSameOrBefore(limiteIniziale)) {
                $('.mese-prec').prop('disabled', true);
           }
         }




    });

    function stampaFestivi(variabileMeseCorrente) {
        $.ajax({
            url: 'https://flynn.boolean.careers/exercises/api/holidays',
            method: 'GET',
            data: {
                year: variabileMeseCorrente.year(),
                month: variabileMeseCorrente.month()
            },
            success: function (data) {
                var giorniFestivi = data.response;
                for (var i = 0; i < giorniFestivi.length; i++) {
                    var giornoFestivo = giorniFestivi[i];
                    var nomeFestivo = giornoFestivo.name;
                    var dataFestivo = giornoFestivo.date;
                    $('#calendar li[data-day="' + dataFestivo + '"]').addClass('festivo').append(' - ' + nomeFestivo);
                }
            }
        });
    }

    function stampaGiorniMese(meseDaStampare) {
        $('#calendar').empty();
        var standardDay = meseDaStampare.clone(); // cloniamo il mese da stampare per poterlo inserire dentro all'attributo data-day
        var giorniMese = meseDaStampare.daysInMonth(); // Quanti giorni ci sono nel mese corrente.
        var nomeMese = meseDaStampare.format('MMMM'); // Prendiamo il nome del mese
        $('#nome-mese').text(nomeMese); // Aggiorniamo il nome del mese in top calendar
        for (var i = 1; i <= giorniMese; i++) {
            // $('#calendar').append('<li>' + i + ' ' + nomeMese + '</li>');
            var giornoDaInserire = {
                day: i + ' ' + nomeMese,
                dataDay: standardDay.format('YYYY-MM-DD')
            }
            var templateFinale = templateGiorno(giornoDaInserire); // Stiamo popolando il template con i dati dell'oggetto
            $('#calendar').append(templateFinale);
            standardDay.add(1, 'day'); // Incrementiamo il valore all'attributo data-day
        }
    }

});
