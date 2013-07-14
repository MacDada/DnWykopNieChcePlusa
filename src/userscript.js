(function() {

    var dnWykopNieChcePlusaInit = function(w, $, undefined) {
        var voters = [];

        try {
            voters = w.localStorage.getItem('dnWNCPvoters').match(/(@\w+)/g);
        } finally {
            if (!$.isArray(voters) || 0 === voters.length) {
                return false;
            }
        }

        var votersOnVotersListsFilter = (function(voters) {
            var r = '';

            $.each(voters, function() {
               // usuwamy małpkę z początku
               r += ':contains("' + this.slice(1) + '"),';
            });

            // wywalamy ostatni zbędny przecinek
            return r.substring(0, r.length - 1);
        })(voters);

    //    console.log(votersOnVotersListsFilter);

//        console.log('page context voters', localStorage.getItem('dnWNCPvoters'));

        var removeVoters = function() {
            var removedCount = parseInt(w.localStorage.getItem('dnWNCPremoved')) || 0;

            var $votersOnVotersLists = $('#activities-stream .votLiC a')
                    .filter(votersOnVotersListsFilter);

        //    $votersOnVotersLists.css('border', '1px solid yellow');

            $votersOnVotersLists.each(function() {
                var $voter = $(this);

                /**
                 * Zmniejszamy liczbę plusów przy komentarzu
                 */
                var $votesResult = $voter.parents('blockquote').find('.votC span');
                var newVotesResult = parseInt($votesResult.text()) - 1;
                $votesResult.text(0 === newVotesResult ? 0 : '+' + newVotesResult);

                /**
                 * Usuwamy pseudonim z listy głosujących
                 */
                var $voterList = $voter.parent('.votLiC');

                $voter.remove();

                if (0 === $voterList.find('a').length) {
                    // wywalamy znak początku listy głosujących
                    $voterList.text('');
                }

                removedCount++;
            });

            w.localStorage.setItem('dnWNCPremoved', removedCount);
        };

        /**
         * Usuwamy gości na starcie
         */
        removeVoters();

        /**
         * Usuwamy gości po ajaksach
         */
        $(w.document).ajaxComplete(function() {
            setTimeout(removeVoters, 100);
        });
    }; // eo dnWykopNieChcePlusaInit()


    // wsadzamy całość w kontekst strony, bo inaczej nie ma jak nasłuchiwać ajaxComplete :/
    var script = window.document.createElement("script");
    script.text = '(' + dnWykopNieChcePlusaInit.toString() + ')(window, $);';
    window.document.body.appendChild(script);


    // pokazujemy ikonkę ustawień
    chrome.runtime.sendMessage({ showBackgroundIcon: true });


    // zwracamy zapisanych userów na żądanie zakładki ustawień
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.voters) {
            var voters = localStorage.getItem('dnWNCPvoters') || '';

            sendResponse({ voters: voters });
        } else if (request.newVoters) {
            try {
                localStorage.setItem('dnWNCPvoters', request.newVoters);
                sendResponse({ newVotersSaved: true });
            } catch (e) {
                sendResponse({ newVotersSaved: false, error: e.toString() });
            }
        } else {
            console.error('userscript.js: unknown request', request);
        }
    });
})();