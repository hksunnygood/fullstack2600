// using IIFE
(() => {
    const navigation = {
        home: { title: "Home Page", url: "Home", section: "Home" },
        about: { title: "About Page", url: "About", section: "About" },
        wines: { title: "Member Page", url: "Member/Wines", section: "Wines" },
        grape: { title: "Member Page", url: "Member/Grapes", section: "Grapes" },
        postreview: { title: "Member Page", url: "PostReview", section: "Postreview" },
        admin: { title: "Admin Page", url: "Admin", section: "Admin" },
        register: { title: "Register Page", url: "Account/Register", section: "Register" },
        login: { title: "Login Page", url: "Account/Login", section: "Login" }
    }
    const registerWarning = document.querySelector('#Register div[name="error"]')
    const loginWarning = document.querySelector('#Login div[name="error"]')
    let email = undefined
    //----------------------------------------------------
    /**
     * Utility functions
    */
    //----------------------------------------------------
    const getJSONData = async (url) => {
        const response = await window.fetch(url)
        const data = await response.json()
        return data
    }
    const populateCountries = async() =>{
        const data = await getJSONData('/countries')
        let dropdown1 = document.getElementById("country")
        let dropdown2 = document.getElementById("country2")
        for (let i = 0; i < Object.keys(data).length; ++i) {
            let option1 = document.createElement("option")
            let option2 = document.createElement("option")
            option1.text = Object.keys(data)[i]
            option2.text = Object.keys(data)[i]
            dropdown1.add(option1)
            dropdown2.add(option2)
        }
    }

    const populateRegions = async() =>{
        let country = document.getElementById("country").value
        const data = await getJSONData('/countries')
        let dropdown = document.getElementById("region")
        dropdown.innerHTML = ''
        for (let j = 0; j < data[country].length; j++) {
            let option = document.createElement("option")
            option.text = data[country][j]
            dropdown.add(option)
        }
    }

    const displayMembers = async() =>{
        const data = await getJSONData('/members')
        console.log(data)
        document.querySelectorAll("thead")[2].innerHTML = `<tr class="table-dark"><th class="h2">#</th><th class="h2">Members Info</th><th>delete?</th></tr>`
        document.querySelectorAll("tbody")[2].innerHTML = ''
        for (let i = 0; i < data.length; i++) {
            if(data[i]['role'] == 'member'){
                let tbody = document.querySelectorAll('tbody')[2]
                var tr = document.createElement('tr')
                tr.innerHTML = `<td><kbd>${i}</kbd></td><td><ul><li>ID: ${data[i]['_id']}</li><li>Email: ${data[i]['email']}</li><li>PW(hashed): ${data[i]['hashedPassword']}</li><li>Registered at: ${data[i]['since']}</li></ul></td><td><input type="radio" id="member" name="member" value=${data[i]['email']}></td>`
                tbody.appendChild(tr)
            }
        }
    }

    const displayWines = async(event) =>{
        let region = event.target.value
        let data = await getJSONData('/wines')
        let i = 1
        let num = data.length
        document.querySelectorAll("thead")[0].innerHTML = `<tr class="table-dark"><th class="h2">#</th><th class="h2">Wines Recommend</th></tr>`
        document.querySelectorAll("tbody")[0].innerHTML = ''
        for (let j = 0; j < num; ++j) {
            if(data[j]['province'] === region){
                let tbody = document.querySelectorAll('tbody')[0]
                var tr = document.createElement('tr')
                tr.innerHTML = `<td><kbd>${i}</kbd></td><td><ul><li><strong>Name: </strong>${data[j]['title']}</li><li><strong>Winery: </strong>${data[j]['winery']}</li><li><strong>Grapes: </strong>${data[j]['variety']}</li><li><strong>Region: </strong>${data[j]['region_1']}</li><li><strong>Rating: </strong>${data[j]['points']}</li><li><strong>Price :</strong>$${data[j]['price']}</li><li><strong>Description: </strong>${data[j]['description']}</li></ul></td>`
                i++
                tbody.appendChild(tr)
            }
        } 
    }

    const displayCarousel = async() => {
        const data = await getJSONData('/grape')
        var div1 = document.querySelector(' div[class="carousel-indicators"]')
        var div2 = document.querySelector(' div[class="carousel-inner"]')
        for(let i=0;i<data.length; i++){
            var button = document.createElement("button")
            var att = document.createAttribute("type")
            att.value = "button"
            button.setAttributeNode(att)
            att = document.createAttribute("data-bs-target")
            att.value = "#carouselExampleIndicators"
            button.setAttributeNode(att)
            att = document.createAttribute("data-bs-slide-to")
            att.value = `${i+1}`
            button.setAttributeNode(att)
            div1.appendChild(button)
            var div_a = document.createElement("div")
            div_a.className = "carousel-item"
            var div_b = document.createElement("div")
            div_b.className = "h1 text-center"
            var text = document.createTextNode(data[i]['name'])
            div_b.appendChild(text)
            div_a.appendChild(div_b)
            var img = document.createElement("img")
            img.className = "d-block w-100"
            img.src = data[i]['link']
            div_a.appendChild(img)
            var span = document.createElement("span")
            span.innerHTML = `<ul><li>Type: ${data[i]['type']}</li><li>Aroma: ${data[i]['aroma']}/li><li>Description: ${data[i]['description']}</li></ul><br>`
            div_a.appendChild(span)
            div2.appendChild(div_a)
        }
    }

    const displayReviews = async () => {
        const reviews = await getJSONData('/reviews')
        if(reviews.length > 0) {
            let thead = document.querySelectorAll("thead")[1]
            thead.innerHTML =''
            let tbody = document.querySelectorAll("tbody")[1]
            tbody.innerHTML = ''
            let tr = document.createElement('tr')
            tr.setAttribute('class', 'text-center h3 table-dark')
            tr.innerHTML = '<th>#</th><th>Reviews</th>'
            thead.appendChild(tr)
            for (let i = 0; i < reviews.length; i++) {
                let tr = document.createElement('tr')
                tr.setAttribute('class', 'text-start')
                tr.innerHTML = `<td><kbd>${i+1}</kbd></td><td><ul><li><strong>Post by: </strong>${reviews[i]['postedBy'].split("@")[0]}</li><li><strong>Wine: </strong>${reviews[i]['wine']}</li><li><strong>Country: </strong>${reviews[i]['country']}</li><li><strong>Review: </strong><i>${reviews[i]['message']}</i></li><li><strong>Date: </strong>${reviews[i]['postedAt']}</li></ul></td>`
                tbody.appendChild(tr)
            } 
        } else{
            console.info(`Posts collection is empty`)
        }
    }

    const postData = async (url = '', data = {}) => {
        console.log("url", url)
        // Default options are marked with *
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        })
        return response.json(); // parses JSON response into native JavaScript objects
    }
    const hide = (element) => element.style.display = 'none'
    const show = (element) => element.style.display = 'block'
    const setCopyrightYear = () => {
        document.querySelector('#footer kbd span').innerHTML = new Date().getFullYear()
    }

    const postreview = async (event) => {
        event.preventDefault()
        let wine = document.getElementById('wine').value
        let country = document.getElementById('country2').value
        let message = document.getElementById('message').value
        const reply = await postData('/addReview', { email,wine,country,message })
        alert("Review message added successfully.")
        displayReviews()
        document.getElementById('reviewform').reset()
        window.history.pushState(navigation.postreview, "", `/${navigation.postreview.url}`)
        displaySection(navigation.postreview)
    }

    const deletemember = async (event) => {
        event.preventDefault()
        let email = document.querySelector('input[type=radio]:checked').value
        const reply = await postData('/deleteMem', {email})
        alert("Member deleted successfully.")
        displayMembers()
        window.history.pushState(navigation.admin, "", `/${navigation.admin.url}`)
        displaySection(navigation.admin)
    }

    const signup = async (event) => {
        // prevent refreshing the page
        event.preventDefault()
        email = document.querySelector('#Register input[name="email"]').value
        let password = document.querySelector('#Register input[name="password"]').value
        let confirm = document.querySelector('#confirm').value

        if (password == confirm) {
            if (password.length < 6){
                registerWarning.innerHTML = 'Password needs to be at least 6 chars!'
                show(registerWarning)
            } else {
                const reply = await postData('/signup', { email, password })
                if (reply.error) {
                    registerWarning.innerHTML = `${reply.error}`
                    show(registerWarning)
                }
                else if (reply.success) {
                    console.log(reply, reply)
                    window.history.pushState(navigation.wines, "", `/${navigation.wines.url}`)
                    displaySection(navigation.wines)
                    authorize(true)
                    document.querySelector('[data-authenticated] > span').innerHTML = `Hi ${email} `
                    document.getElementById('postedBy').setAttribute('value', email)
                }
            }
        }
        else {
            registerWarning.innerHTML = 'Passwords do not match. Re-enter your password'
            show(registerWarning)
        }
    }

    const signout = async (event) => {
        event.preventDefault()
        const reply = await postData('/signout', { email })
        if (reply.success) {
            window.history.pushState(navigation.home, "", `/${navigation.home.url}`)
            displaySection(navigation.home)
            authorize(false)
            adminAuthorize(false)
        } else {
            console.log(reply)
        }
    }

    const signin = async (event) => {
        event.preventDefault()
        email = document.querySelector('#Login input[name="email"]').value
        let password = document.querySelector('#Login input[name="password"]').value
        const reply = await postData('/signin', { email, password })
        if (reply.error) {
            loginWarning.innerHTML = `${reply.error}`
            show(loginWarning)
        }
        else if (reply.admin){
            console.log("Admin shown")
            displayMembers()
            window.history.pushState(navigation.admin, "", `/${navigation.admin.url}`)
            displaySection(navigation.admin)
            adminAuthorize(true)
            document.querySelector('[admin-authenticated] > span').innerHTML = `Admin `
        } else if(reply.success) {
            window.history.pushState(navigation.wines, "", `/${navigation.wines.url}`)
            displaySection(navigation.wines)
            authorize(true)
            document.querySelector('[data-authenticated] > span').innerHTML = `Hi ${email} `
        }
    }

    const setActivePage = (section) => {
        let menuItems = document.querySelectorAll('a[data-page]')
        menuItems.forEach(menuItem => {
            if (section === menuItem.textContent)
                menuItem.classList.add("active")
            else
                menuItem.classList.remove("active")
        })
    }

    const displaySection = (state) => {
        const sections = document.querySelectorAll('section')
        sections.forEach(section => {
            let name = section.getAttribute('id')
            if (name === state.section) {
                document.title = state.title
                show(section)
                setActivePage(name)
            }
            else
                hide(section)
        })
    }

    const authorize = (isAuthenticated) => {
        const authenticated = document.querySelectorAll('[data-authenticated]')
        const nonAuthenticated = document.querySelector('[data-nonAuthenticated]')
        if(isAuthenticated) { 
            authenticated.forEach(element => show(element))
            hide(nonAuthenticated)
        }
        else {
            authenticated.forEach(element => hide(element))
            show(nonAuthenticated)
        }
    }

    const adminAuthorize = (isAuthenticated) => {
        const authenticated = document.querySelectorAll('[admin-authenticated]')
        const nonAuthenticated = document.querySelector('[data-nonAuthenticated]')
        if(isAuthenticated) { 
            authenticated.forEach(element => show(element))
            hide(nonAuthenticated)
        }
        else {
            authenticated.forEach(element => hide(element))
            show(nonAuthenticated)
        }
    }

    window.onpopstate = (event) => {
        if (event.state) {
            displaySection(event.state)
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        displaySection(navigation.home)
        window.history.replaceState(navigation.home, "", document.location.href);
        setCopyrightYear()
        populateCountries()
        document.querySelector('#country').onchange = populateRegions
        document.getElementById('region').onchange = displayWines
        document.onclick = (event) => {
            const page = event.target.getAttribute('data-page')
            if (page) {
                event.preventDefault()
                displayReviews()
                hide(registerWarning)
                window.history.pushState(navigation[page], "", `/${navigation[page].url}`)
                displaySection(navigation[page])
            }
        }
        authorize(false)
        adminAuthorize(false)
        const noticeDialog = document.querySelector("#noticeDialog")
        const errors = document.querySelectorAll('section div[name="error"]')
        errors.forEach(error => hide(error))
        
        noticeDialog.showModal()
        displayCarousel()
        document.querySelector("#noticeButton").onclick = (event) => {
            event.preventDefault()
            if (document.querySelector("#agree").checked)
                noticeDialog.close()
        }
        window.onpopstate = (event) => {
            if (event.state){
                displaySection(event.state)
            }
        }

        document.querySelector("#signup").onclick = signup
        document.querySelector("#signout1").onclick = signout
        document.querySelector("#signout2").onclick = signout
        document.querySelector("#signin").onclick = signin
        document.querySelector("#post_review").onclick = postreview
        document.querySelector("#savechange").onclick = deletemember

    })
})()
