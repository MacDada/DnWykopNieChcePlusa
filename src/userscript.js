(function () {

    var dnWykopNieChcePlusaInit = function (w, $) {
        var voters;
        var votersOnVotersListsFilterSelector;

        function loadVotersArray() {
            try {
                voters = w.localStorage.getItem('dnWNCPvoters').match(/(@\w+)/g);
            } finally {
                if (!$.isArray(voters) || 0 === voters.length) {
                    return false;
                }
            }

            return voters;
        };

        function createFilterVotersSelector(voters) {
            var selector = '';

            $.each(voters, function () {
               // slicem usuwamy małpkę z początku
               selector += ':contains("' + this.slice(1) + '"),';
            });

            // wywalamy ostatni zbędny przecinek
            return selector.substring(0, selector.length - 1);
        };

        function removeVoters() {
            var removedCount = 0;

            // lista plusujących pod wpisami/komentarzami
            var $votersOnVotersLists = $('#itemsStream .voters-list a')
                .filter(votersOnVotersListsFilterSelector);

            $votersOnVotersLists.each(function () {
                var $voter = $(this);

                /**
                 * Zmniejszamy liczbę plusów przy wpisie/komentarzu
                 */
                var $votesResult = $voter.parents('.dC').find('.vC span');
                var newVotesResult = parseInt($votesResult.text()) - 1;
                $votesResult.text(newVotesResult ? '+' + newVotesResult : 0);

                /**
                 * Usuwamy pseudonim z listy głosujących
                 */
                var $voterList = $voter.parent('.voters-list');

                var separator = $voter.get(0).nextSibling;
                if (separator && ', ' === separator.nodeValue) {
                    separator.remove();
                }

                $voter.remove();

                if (0 === $voterList.find('a').length) {
                    // wywalamy znak początku listy głosujących
                    $voterList.text('');
                }

                removedCount++;
            });

            var savedRemovedCount = parseInt(w.localStorage.getItem('dnWNCPremoved')) || 0;
            w.localStorage.setItem('dnWNCPremoved', savedRemovedCount + removedCount);
        };

        voters = loadVotersArray();

        if (!voters) {
            return false;
        }

        votersOnVotersListsFilterSelector = createFilterVotersSelector(voters);
        console.log('dnWNCP:votersOnVotersListsFilterSelector', votersOnVotersListsFilterSelector);

        /**
         * Usuwamy gości na starcie
         */
        removeVoters();

        /**
         * Usuwamy gości po ajaksach
         */
        $(w.document).ajaxComplete(function () {
            // todo: ajax przeładowuje całą listę, więc trzeba to uwzględnić,
            //       bo przy podwójnym usuwaniu zaniżamy liczbę głosów
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
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
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
