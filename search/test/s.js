
      document.addEventListener('DOMContentLoaded', _ => {
        fetch('/data/search/groups7n.json')
          .then(data => data.json())
          .then(data => {
            const searchData = {};

            data.index_data.forEach(({id, ccs, pianostudi, annocorso}) => {
              if (!searchData[ccs]){
                searchData[ccs] = {};
              }

              if (!searchData[ccs][pianostudi]){
                searchData[ccs][pianostudi] = {
                  'All': {}
                };
              }

              if (!searchData[ccs][pianostudi][annocorso]){
                searchData[ccs][pianostudi][annocorso] = {};
              }

              let tmp = genHtml(data.info_data[id]);
              searchData[ccs][pianostudi][annocorso][id] = tmp;
              searchData[ccs][pianostudi]['All'][id] = tmp;
            });

            _updateDatalist(searchData, 'ccs');

            window.searchData = searchData;

            document.getElementById('content-loading').classList.add('hide');
            document.getElementById('content-form').classList.remove('hide');
          })
          .catch(e => {
            console.error(e);
            alert('Impossibile Caricare la ricerca. Controlla la tua connessione a internet');
          });
      });

      function onCcsClick(){
        document.getElementById(`content-form-ccs-input`).value = '';
        document.getElementById(`content-form-pianostudi-input`).value = '';
        document.getElementById(`content-form-annocorso-input`).value = '';
        document.getElementById('content-result').innerHTML = '';
      }

      function onPianostudiClick(){
        document.getElementById(`content-form-pianostudi-input`).value = '';
        document.getElementById(`content-form-annocorso-input`).value = '';
        document.getElementById('content-result').innerHTML = '';
      }

      function onAnnocorsoClick(){
        document.getElementById(`content-form-annocorso-input`).value = '';
        document.getElementById('content-result').innerHTML = '';
      }

      function onCcsSelect(){
        let ccs = document.getElementById(`content-form-ccs-input`).value;
        let list = _updateDatalist(window.searchData[ccs], 'pianostudi');
        if (list.length > 0){
          document.getElementById(`content-form-pianostudi-input`).value = list[0];
          onPianostudiSelect();
        }
      }

      function onPianostudiSelect(){
        let ccs = document.getElementById(`content-form-ccs-input`).value;
        let pianostudi = document.getElementById(`content-form-pianostudi-input`).value;
        let list = _updateDatalist(window.searchData[ccs][pianostudi], 'annocorso');
        if (list.length > 0){
          document.getElementById(`content-form-annocorso-input`).value = 'All';
          onAnnocorsoSelect()
        }
      }

      function onAnnocorsoSelect(){
        let ccs = document.getElementById(`content-form-ccs-input`).value;
        let pianostudi = document.getElementById(`content-form-pianostudi-input`).value;
        let annocorso = document.getElementById(`content-form-annocorso-input`).value;

        // Ignoring error due to wrong search query. No Problem, user will, eventually, fix the query.
        let tmp = Object.keys(window.searchData[ccs][pianostudi][annocorso])
          .map(k => window.searchData[ccs][pianostudi][annocorso][k])
          .join("");
        document.getElementById('content-result').innerHTML = tmp;
      }

      // function selectHandler(){
      //   let ccs = document.getElementById(`content-form-ccs-input`).value;
      //   let pianostudi = document.getElementById(`content-form-pianostudi-input`).value;
      //   let annocorso = document.getElementById(`content-form-annocorso-input`).value;
      //
      //   // Ignoring error due to wrong search query. No Problem, user will, eventually, fix the query.
      //   _updateDatalist(window.searchData[ccs], 'pianostudi');
      //   _updateDatalist(window.searchData[ccs][pianostudi], 'annocorso');
      //   let tmp = Object.keys(window.searchData[ccs][pianostudi][annocorso])
      //     .map(k => window.searchData[ccs][pianostudi][annocorso][k])
      //     .join("");
      //   document.getElementById('content-result').innerHTML = tmp;
      // }

      function genHtml(data){
        return `<li>${JSON.stringify(data)}</li>`;
      }

      function _updateDatalist(data, id){
        data = data || [];

        let tmp = Object.keys(data)
          .filter(item => item && item !== 'null');

        if (tmp.length === 0){
          return [];
        }

        document.getElementById(`content-form-${id}-datalist`).innerHTML = tmp
          .map(k => `<option value="${k}"></option>`);
        return tmp;
      }
