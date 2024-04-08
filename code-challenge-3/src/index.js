
const films = document.getElementById('films')

window.addEventListener('load',()=>{
    fetch('http://localhost:3000/films')
    .then(response =>
        response.json())
    .then((data)=>{
        console.log(data)
        data.forEach(item=>{
            var item_list = document.createElement('li')
            var item_div = document.createElement('div')
            item_div.style.marginTop = '2vh'
            var item_name = document.createElement('h3')
            var item_poster= document.createElement('img')
            item_poster.style.width = '10vw'
            var item_time = document.createElement('h4')
            var item_tickets = document.createElement('p')
            var item_button = document.createElement('button')
            var item_remaining_tickets = document.createElement('p')

            item_button.textContent = 'Buy ticket'
            item_button.setAttribute('onclick','buyTicket(this.value)')
            item_button.setAttribute('value',item.id)
            item_name.textContent = item.title
            item_poster.setAttribute('src',item.poster)
            item_time.textContent = 'Show time:'+ item.showtime
            item_remaining_tickets.setAttribute('id','tickets'+item.id)
            item_remaining_tickets.style.display = 'none'
            item_remaining_tickets.textContent = item.capacity - item.tickets_sold
            
            item_tickets.setAttribute('id','item'+item.id)
            item_tickets.textContent = 'Avalable tickets: '+ item_remaining_tickets.textContent
            item_div.appendChild(item_poster)
            item_div.appendChild(item_name)
            item_div.appendChild(item_time)
            item_div.appendChild(item_tickets)
            item_div.appendChild(item_button)
            item_div.appendChild(item_remaining_tickets)
            item_list.appendChild(item_div)
            films.appendChild(item_list)
        })
    })
})
function buyTicket(Value){
    var item_tickets = document.getElementById('item'+Value)
    var item_remaining_tickets = document.getElementById('tickets'+Value)
    var remaining_tickets = Number(item_remaining_tickets.textContent)
    if(remaining_tickets > 0){
        remaining_tickets = remaining_tickets-1
        item_tickets.textContent = 'Avalable tickets: '+ remaining_tickets
        item_remaining_tickets.textContent = remaining_tickets
        
    }
}
