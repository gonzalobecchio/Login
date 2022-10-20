window.onload = () => {
    const form = document.getElementById('form-login')
    const a = document.getElementById('logout')


    form.onsubmit = async (e) => {
        e.preventDefault()
        const fd = new FormData(form)
        const dates = Object.fromEntries(fd)

        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(dates)
        })
        const page = await response.text()
        document.getElementById('content').innerHTML = page
    }

   

}