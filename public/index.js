//  Use and think about Class activities, Day 3. //
let chart;
let anyTransaction = [];


function displayTotal() {
  
    let total = anyTransaction.reduce((total, t) => {
  
    return total + parseInt(t.value);
  
    }, 0);

    let totalEl = document.querySelector('#total');
  
    totalEl.textContent = total;

};



function displayLedger() {
  
    let tbody = document.querySelector('#tbody');
  
    tbody.innerHTML = '';

    anyTransaction.forEach(transaction => {
   
        let tr = document.createElement('tr');
        
        tr.innerHTML = `<td>${transaction.name}</td><td>${transaction.value}</td>`;

        tbody.appendChild(tr);
    
    });
};



function displayChart() {
  
    let reversed = anyTransaction.slice().reverse();
    let sum = 0;
    let labels = reversed.map(t => {
    
        
        let date = new Date(t.date);
    
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  
    });


    let data = reversed.map(t => {

    sum += parseInt(t.value);

    return sum;

    });


    // KEY: DROPS OLD CHART DATA. //
    if (chart) {
    
    chart.destroy();
  
    }


    let ctx = document.getElementById('chart').getContext('2d');

    chart = new Chart(ctx, {
        
        type: 'line',
        
        data: {
        
            labels,
        
            datasets: [{label: 'Total Over Time', fill: true, backgroundColor: '#dfb26a', data }]
        }
    });
}



function credit(add) {
 
    let nameEl = document.querySelector('#t-name');
    let amntEl = document.querySelector('#t-amount');
    let errEl = document.querySelector('.form .error');

    
    if (nameEl.value === '' || amntEl.value === '') {
     
        errEl.textContent = 'Data Is iIncomplete or Missing.';
     
        return;
    }


    else {
    
        errEl.textContent = '';
    
    }


    let transaction = {
      
        name: nameEl.value,
      
        value: amntEl.value,
      
        date: new Date().toISOString()
    };

    
    // PUTS THE DIGITS IN THE RED. //
    if (!add) {
    
        transaction.value *= -1;
    
    }


    anyTransaction.unshift(transaction);

    
    // REFRESHES AND CLEARS DATA FOR THE USER TO REUSSE A CLEAR CHART. //
    displayChart();
    displayLedger();
    displayTotal();

  
    fetch('/api/transaction', {
    
       
        method: 'POST',
    
       
        body: JSON.stringify(transaction),
    
        headers: {
    
            Accept: 'application/json, text/plain, */*',
    
            'Content-Type': 'application/json'
        }
    })


    .then(response => {    
     
        return response.json();
   
    })


  .then(data => {
   
    if (data.errors) {
  
        errEl.textContent = 'Data Is iIncomplete or Missing.';
  
    }
    else {
  
      nameEl.value = '';
      
      amntEl.value = '';
  
    }
  
})


.catch(err => {

    saveRecord(transaction);

    nameEl.value = '';
    
    amntEl.value = '';
  
    });
};



document.querySelector('#add-btn').onclick = function() {

    credit(true);

};



document.querySelector('#sub-btn').onclick = function() {
  
    credit(false);

};



fetch('/api/transaction')


.then(response => {

    return response.json();

})



.then(data => {
    
    anyTransaction = data;

    displayTotal();
    displayLedger();
    displayChart();

});