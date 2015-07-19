chrome.tabs.getSelected(null, function (tab) {
    var $usernames = $('#usernames');
    var $result = $('#result');

    // prosimy userscript o wczytanie zapisanych userów do zblokowania
    chrome.tabs.sendMessage(tab.id, { voters: true }, function (response) {
        console.log('popup.js: currently saved voters response', response);

        $usernames.val(response.voters);

        // todo: podpowiadanie z jakiegoś powodu wybucha
        $usernames.suggest('https://www.wykop.pl/ajax/suggest/', { natural: true });
    });

    // zapisujemy dane przy pomocy userscripta
    $('form').submit(function (e) {
        e.preventDefault();

        chrome.tabs.sendMessage(tab.id, { newVoters: $usernames.val() }, function (response) {
            if (response.newVotersSaved) {
                console.log('popup.js: zapisano nową listę do zblokowania!');
                $result.text('Zapisano!');
            } else {
                console.error('popup.js: unknown response', response);
                $result.text('Błąd zapisu :(');
            }
        });
    });
});
