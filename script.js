(function($, doc) {
  'use strict';

  var app = (function() {

    return {
      init: function init() {
        this.initEvents();
      },

      initEvents() {
        $('.btn-login').on('click', this.openLogin);
        $('.btn-login-page').on('click', this.handleLogin);
        $('.btn-search').on('click', this.handleSearch);
        $('.btn-logout').on('click', this.handleLogout);
      },

      handleLogout: function handleLogout() {
        var $btnLogin = $('.btn-login').get();
        var $btnLogout = $('.btn-logout').get();
        var $initialContent = $('.initial-content').get();
        var $loginContent = $('.login-content').get();
        var $searchContent = $('.search-content').get();

        localStorage.removeItem('user');

        $btnLogin.style.display = 'block';
        $btnLogout.style.display = 'none';
        $initialContent.style.display = 'flex';
        $searchContent.style.display = 'none';
        $loginContent.style.display = 'none';
      },

      openLogin: function openLogin() {
        var $initialContent = $('.initial-content').get();
        var $loginContent = $('.login-content').get();
        var $searchContent = $('.search-content').get();
        var $btnLogin = $('.btn-login').get();
        var $btnLogout = $('.btn-logout').get();

        if (localStorage.getItem('user') === null) {
          $initialContent.style.display = 'none';
          $searchContent.style.display = 'none';
          $loginContent.style.display = 'flex';
        } else {
          $initialContent.style.display = 'none';
          $searchContent.style.display = 'flex';
          $loginContent.style.display = 'none';
          $btnLogin.style.display = 'none';
          $btnLogout.style.display = 'block';
        }
      },

      handleLogin: async function handleLogin() {
          var $inputEmail = $("#email").get();
          var $inputPassword = $("#password").get();

          var $loginContent = $('.login-content').get();
          var $searchContent = $('.search-content').get();
          var $btnLogin = $('.btn-login').get();
          var $btnLogout = $('.btn-logout').get();

          if ($inputEmail === '' || $inputEmail.length < 3 || $inputPassword === '' || $inputPassword.length < 3) {
            $inputEmail.style.border = '2px solid red';
            $inputPassword.style.border = '2px solid red';

            $inputEmail.value = '';
            $inputPassword.value = '';
          } else {
            try {
              const response = await axios.post('https://reqres.in/api/login', {
                email: $inputEmail.value,
                password: $inputPassword.value
              })
              
              var user = {
                userEmail: $inputEmail.value,
                userPassword: $inputPassword.value
              }
  
              user = JSON.stringify(user)
  
              localStorage.setItem('user', user);

              $inputEmail.style.border = '1px solid transparent';
              $inputPassword.style.border = '1px solid transparent';

              $inputEmail.value = '';
              $inputPassword.value = '';
  
              $searchContent.style.display = 'flex';
              $loginContent.style.display = 'none';
              $btnLogin.style.display = 'none';
              $btnLogout.style.display = 'block';
            } catch (err) {
              $inputEmail.value = '';
              $inputPassword.value = '';
              $inputEmail.style.border = '2px solid red';
              $inputPassword.style.border = '2px solid red';
            }
          }
      },

      handleSearch: async function handleSearch() {
        var $inputSearch = $('#search').get();
        
        const response = await axios.get('https://openlibrary.org/search.json?title=' + $inputSearch.value)
       
        var $ul = $('.books-list').get();
        const $fragment = doc.createDocumentFragment();
        
        $ul.innerText = '';
        $inputSearch.value = '';

        if(response.data.docs.length === 0) {
          var $li = doc.createElement('li');
          var $span = doc.createElement('span');

          $span.textContent = 'Nenhum livro encontrado.';

          $li.appendChild($span);
          $fragment.appendChild($li);
          $ul.appendChild($fragment);
        } else {
          response.data.docs.map((item) => {
            var $li = doc.createElement('li');
            var $title = doc.createElement('p');
            var $publishYear = doc.createElement('p');
            var $totalPages = doc.createElement('p');
            var $author = doc.createElement('p');
            var $row1 = doc.createElement('div');
            var $row2 = doc.createElement('div');
            var $row3 = doc.createElement('div');
            var $row4 = doc.createElement('div');

            var $titleValue = doc.createElement('span');
            var $publishYearValue = doc.createElement('span');
            var $totalPagesValue = doc.createElement('span');
            var $authorValue = doc.createElement('span');

            $row1.setAttribute('class', 'row-li');
            $row2.setAttribute('class', 'row-li');
            $row3.setAttribute('class', 'row-li');
            $row4.setAttribute('class', 'row-li');

            $title.textContent = 'Título:';
            $titleValue.textContent = item.title;
            $row1.appendChild($title);
            $row1.appendChild($titleValue);
            $fragment.appendChild($row1);

            $publishYear.textContent = 'Ano de publicação:';
            $publishYearValue.textContent = item.first_publish_year;
            $row2.appendChild($publishYear);
            $row2.appendChild($publishYearValue);
            $fragment.appendChild($row2);

            $totalPages.textContent = 'Quantidade média de páginas:';
            $totalPagesValue.textContent = item.number_of_pages_median;
            $row3.appendChild($totalPages);
            $row3.appendChild($totalPagesValue);
            $fragment.appendChild($row3);

            var authors = '';

            item.author_name.map((author, idx) => {
              if(item.author_name.length - 1 === idx) {
                authors = authors + author;

              } else {
                authors = authors + author + ', ';
              }
            })

            $author.textContent = 'Autor:';
            $authorValue.textContent = authors;
            $row4.appendChild($author);
            $row4.appendChild($authorValue);
            $fragment.appendChild($row4);

            $li.appendChild($fragment);

            $ul.appendChild($li);
          })
        }
      }
    }
  })();

  app.init();

})(window.DOM, document);