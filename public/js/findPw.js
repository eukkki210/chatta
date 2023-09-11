async function findPw() {
    const resultBox = document.querySelector('.result')
    const form = document.forms['findPw-form']
    const data = {
        login_id: form.id.value,
        name: form.name.value,
    }
    const result = await axios({
        method: "post",
        url: "/findpw",
        data,
    })
    if (result.data.result) {
        alert(`${result.data.message}`)
        document.location.href = '/'
    } else {
        resultBox.textContent = `${result.data.message}`
        resultBox.classList.add('show');
    }
}
function cancel() {
    window.location.href='/'
}