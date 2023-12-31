async function deleteFunc() {
    try {
        const resultBox = document.querySelector('.result')
        const form = document.forms['delete-form']
        const data = {
            id: form.id.value,
            login_id: form.login_id.value,
            login_pw: form.login_pw.value,
            Cid: form.Cid.value,
            Cpw: form.Cpw.value,
        }
        if (!confirm('탈퇴하시겠습니까?')) {
            return;
        }
        const res = await axios({
            method: 'POST',
            url: '/profile/edit/delete',
            data,
        })
        if (res.data.result) {
            alert('회원 탈퇴되었습니다.')
            document.location.href = '/';
        } else {
            resultBox.textContent = (`${res.data.message}`)
            resultBox.classList.add('show');
        }
    } catch (error) {
        console.log(error)
    }
}

function cancel() {
    window.location.href='/profile/edit'
}