document.addEventListener('DOMContentLoaded', () => {
    const boxes = document.querySelectorAll('.letter-box');
    const keys = document.querySelector('.keyboard');

    keys.addEventListener('click', function(e) {
        if(e.target.classList.contains('keyboard__key')){
            const selectedKeyText = e.target.innerText;
            const letterBoxes = document.querySelectorAll('.active-row .letter-box');
            const emptyBox = Array.from(letterBoxes).find(box => box.value === '');

            if (emptyBox) {
                emptyBox.value = selectedKeyText;
            }
        }
    });

    document.getElementById('submit-word').addEventListener('click', function(event) {
        event.preventDefault();
        const activeRow = document.querySelector('.word-row.active-row');   
        const letterInputs = activeRow.querySelectorAll('.letter-box');
        
            let word = '';
            letterInputs.forEach(input => {
                word += input.value;
                input.classList.add('animate-flip');

                input.addEventListener('animationend', () => {
                    input.classList.remove('animate-flip');
                }, { once: true });
            });

            if(word.length == 5){

                fetch('process.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: 'word=' + word
                })
                .then(response => response.json())
                .then(data => {
                    //console.log(data);
                    //console.log("Palavra enviada: ", word);
                    if(data !== false){
                        updateLetterBoxes(letterInputs, data);
                    }else{
                        alert("Palavra inválida!");
                    }
                })
                .catch(error => {
                    console.error('Erro ao enviar a palavra:', error);
                })
            }else{
                alert("Apenas palavras com 5 letras!");
            }
        })

    document.getElementById('new-word').addEventListener('click', function(event){
        fetch('process.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'sort=true'
        })
        .then(response => response.text())
        .catch(error => {
            console.error('Error:', error);
        });
    }); 
    
    function updateLetterBoxes(letterInputs, data){
        if(data.char1 && data.char1_position){
            data.char1.forEach((char, index) => {
                const position = data.char1_position[index] - 1;
                //console.log("Pintando verde letter-box de posicao: ", position + 1)
                setTimeout(function(){
                    letterInputs[position].style.backgroundColor = 'green';
                    letterInputs[position].style.color = 'white'; 
                },100);
            });
        }
        
        if(data.char2 && data.char2_position){
            data.char2.forEach((char, index) => {
                if(data.char2_position != data.char1_position){
                    const position_2 = data.char2_position[index] - 1;
                    //console.log("Position_2:", position_2 + 1);
                    const currentColor = letterInputs[position_2].style.backgroundColor;
                    //console.log("Cor atual:", currentColor);
                    if (currentColor !== 'green') {
                        //console.log("Pintando amarelo letter-box de posicao: ", position_2 + 1)
                        letterInputs[position_2].style.backgroundColor = 'yellow';
                    }
                }
            });
        }

        if(data.char1.length == '5'){
            setTimeout(function(){
                alert("Você ganhou!");

                const allLetterInputs = document.querySelectorAll('.letter-box');
                allLetterInputs.forEach(input => {
                    input.disabled = true;
                });

                const enabledButton = document.querySelector('#new-word');
                enabledButton.disabled = false;
                
            }, 150);
            return;
        }
        
        const activeRow = document.querySelector('.word-row.active-row');

        activeRow.querySelectorAll('.letter-box').forEach(input =>
            {
                input.disabled = true;
            });

        activeRow.classList.remove('active-row');

        const nextRow = activeRow.nextElementSibling;

        if (nextRow && nextRow.classList.contains('word-row')){
            nextRow.classList.add('active-row');
            nextRow.querySelectorAll('.letter-box').forEach(input =>
                {
                    input.disabled = false;
                });
        }
    }

    boxes.forEach((box, index, boxArray) => {

        box.addEventListener('click', function() {
            const length = this.value.length;
            this.setSelectionRange(length, length);
        });

        box.addEventListener('input', function() {
        if(/^[A-Za-z]$/.test(this.value)){
            this.value = this.value.toUpperCase();
            if (this.value.length === 1) {
                const nextBox = boxArray[index + 1];
                if (nextBox) {
                    nextBox.focus();
                }   
            }
        }else{
            this.value = '';
        }
            
        });

        box.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value.length === 0) {
                const prevBox = boxArray[index - 1];
                if (prevBox) {
                    prevBox.focus();
                }
            }
        });
    });
});
