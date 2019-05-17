<?php

$name = $_POST['name'];
$phone = $_POST['phone'];

require_once('phpmailer/PHPMailerAutoload.php');
$mail = new PHPMailer;
$mail->CharSet = 'utf-8';

//$mail->SMTPDebug = 3;                               // Enable verbose debug output

$mail->isSMTP();                                      // Set mailer to use SMTP
$mail->Host = 'smtp.gmail.com';  // Specify main and backup SMTP servers
$mail->SMTPAuth = true;                               // Enable SMTP authentication
$mail->Username = 'forwebdev15@gmail.com';                 // Наш логин
$mail->Password = 'utiputi01';                           // Наш пароль от ящика
$mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
$mail->Port = 465;                                    // TCP port to connect to

$mail->setFrom('forwebdev15@gmail.com', 'Repair');   // От кого письмо 
$mail->addAddress('errewer123@gmail.com');     // Add a recipient
// $mail->addAddress('dustov.timur@yandex.ru');               // Name is optional
//$mail->addReplyTo('info@example.com', 'Information');
//$mail->addCC('cc@example.com');
//$mail->addBCC('bcc@example.com');
//$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
//$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
$mail->isHTML(true);                                  // Set email format to HTML

$mail->Subject = 'Новая заявка!';
$mail->Body    = '
	Пользователь оставил заявку!<br>
	Имя пользователя: ' . $name . '<br>
	Телефон: ' . $phone . '';
$mail->AltBody = 'Это альтернативный текст';

if (!$mail->send()) {
	echo 'Mailer Error: ' . $mail->ErrorInfo;
} else {
	return true;
}
