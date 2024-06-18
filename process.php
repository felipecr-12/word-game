<?php
        session_start(); // Inicia a sessão
        header('Content-Type: application/json');
        $file_words = 'C:\xampp\htdocs\TERMO\palavras_5_letras.txt';
        $words = file($file_words, FILE_IGNORE_NEW_LINES);
        $validation_words = file('C:\xampp\htdocs\TERMO\words.txt', FILE_IGNORE_NEW_LINES);
        if (isset($_POST['sort']) && $_POST['sort'] == 'true'){
            $_SESSION['keyS'] = strtoupper($words[array_rand($words)]);
        }

        if (!isset($_SESSION['keyS'])) {
            // Escolhe uma nova palavra se não existir na sessão
            $_SESSION['keyS'] = strtoupper($words[array_rand($words)]);
        }

        $keyS = $_SESSION['keyS'];
        if($_SERVER["REQUEST_METHOD"] == "POST"){
            $inputS = $_POST['word'];

            if (!in_array(strtolower($inputS), $validation_words)) {
                echo json_encode(false);
                exit();
            }

            $char1 = array();
            $char1_position = array();
            $char2 = array();
            $char2_position = array();

            $match = array();
            $exactlyMatch = array();

            for($i = 0; $i < 5; $i++){
                for($j = 0; $j < 5; $j++){
                    if (($inputS[$j] == $keyS[$i]) && ($i == $j)){
                        $exactlyMatch[] = array("char" => $inputS[$j], "position" => $i + 1);
                    }else if ($inputS[$j] == $keyS[$i]){
                        $match[] = array("char" => $inputS[$j], "position" => $j + 1, "position_linked" => $i + 1);
                    }
                }  
            }

            $filteredMatch = [];
            foreach ($match as $entry_2) {
                $existsInExactlyMatch = false;
                foreach ($exactlyMatch as $entry) {
                    if  ($entry_2["position_linked"] == $entry["position"]){
                        $existsInExactlyMatch = true;
                        break;
                    }
                }
                if (!$existsInExactlyMatch) {
                    $filteredMatch[] = $entry_2;
                }
            }
             
            foreach ($exactlyMatch as $entry) {
                $char1[] = $entry["char"];
                $char1_position[] = $entry["position"]; 
            }

            foreach ($filteredMatch as $entry_2) {
                $char2[] = $entry_2["char"];
                $char2_position[] = $entry_2["position"];
            }

            $response = [
                "word" => $inputS,
                "char1" => $char1,
                "char1_position" => $char1_position,
                "char2" => $char2,
                "char2_position" => $char2_position,
                "filteredMatch" => $filteredMatch
            ];

            echo json_encode($response);
            
        }
?>