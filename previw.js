'use strict'

export function preview ({target}) {
    if (target.files && target.files[0]) { 
        document.getElementById('preview-image').src = URL.createObjectURL(target.files[0])
    }
}

document.getElementById('preview-input')
        .addEventListener('change', preview)