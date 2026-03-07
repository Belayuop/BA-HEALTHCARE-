<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Search Hospitals - BA Healthcare</title>
<style>
body {font-family: Arial, sans-serif; background:#f4f4f9; margin:0; padding:0;}
header {background:#2E8B57; color:white; padding:20px; text-align:center;}
h1 {margin:0;}
.container {max-width:1200px; margin:20px auto; padding:10px;}
input[type=text], select {padding:8px; width:250px; margin-right:10px; border-radius:5px; border:1px solid #ccc;}
button {padding:8px 15px; background:#2E8B57; color:white; border:none; border-radius:5px; cursor:pointer;}
table {width:100%; border-collapse: collapse; margin-top:20px; background:white; box-shadow:0 0 10px rgba(0,0,0,0.1);}
th, td {padding:10px; border:1px solid #ccc; text-align:left;}
th {background:#3CB371; color:white;}
tr:nth-child(even) {background:#f2f2f2;}
</style>
</head>
<body>
<header>
<h1>Search Hospitals</h1>
<p>Find top hospitals in Ethiopia by name, type, or location</p>
</header>

<div class="container">
<form method="GET">
<input type="text" name="query" placeholder="Search by hospital name">
<select name="type">
    <option value="">All Types</option>
    <option value="Public">Public</option>
    <option value="Private">Private</option>
    <option value="Specialized">Specialized</option>
</select>
<input type="text" name="location" placeholder="Search by location">
<button type="submit">Search</button>
</form>
<?php

header("Content-Type: application/json");

/* DATABASE CONNECTION */

$host = "localhost";
$user = "root";
$password = "";
$db = "myhealthid";

$conn = new mysqli($host,$user,$password,$db);

if($conn->connect_error){
die("DB ERROR");
}

$action = $_GET['action'] ?? "";


/* =========================
REGISTER USER
========================= */

if($action=="register"){

$data=json_decode(file_get_contents("php://input"),true);

$name=$data["name"];
$email=$data["email"];
$password=password_hash($data["password"],PASSWORD_DEFAULT);

$sql="INSERT INTO users(name,email,password,role)
VALUES('$name','$email','$password','patient')";

if($conn->query($sql)){
echo json_encode(["status"=>"success"]);
}else{
echo json_encode(["status"=>"error"]);
}

}


/* =========================
LOGIN
========================= */

if($action=="login"){

$data=json_decode(file_get_contents("php://input"),true);

$email=$data["email"];
$password=$data["password"];

$sql="SELECT * FROM users WHERE email='$email'";

$result=$conn->query($sql);

if($result->num_rows>0){

$user=$result->fetch_assoc();

if(password_verify($password,$user["password"])){

echo json_encode([
"status"=>"success",
"user"=>$user
]);

}else{

echo json_encode(["status"=>"wrong_password"]);

}

}else{

echo json_encode(["status"=>"no_user"]);

}

}


/* =========================
GET MEDICAL RECORDS
========================= */

if($action=="records"){

$user_id=$_GET["user_id"];

$sql="SELECT * FROM medical_records WHERE user_id='$user_id'";

$result=$conn->query($sql);

$records=[];

while($row=$result->fetch_assoc()){

$records[]=$row;

}

echo json_encode($records);

}


/* =========================
CHAT MESSAGE
========================= */

if($action=="send_message"){

$data=json_decode(file_get_contents("php://input"),true);

$user_id=$data["user_id"];
$message=$data["message"];

$sql="INSERT INTO chat(user_id,message)
VALUES('$user_id','$message')";

$conn->query($sql);

echo json_encode(["status"=>"sent"]);

}


/* =========================
GET CHAT
========================= */

if($action=="chat"){

$result=$conn->query("SELECT * FROM chat ORDER BY id DESC LIMIT 20");

$messages=[];

while($row=$result->fetch_assoc()){
$messages[]=$row;
}

echo json_encode($messages);

}


/* =========================
APPOINTMENT
========================= */

if($action=="appointment"){

$data=json_decode(file_get_contents("php://input"),true);

$user=$data["user_id"];
$date=$data["date"];

$sql="INSERT INTO appointments(user_id,date)
VALUES('$user','$date')";

$conn->query($sql);

echo json_encode(["status"=>"booked"]);

}


/* =========================
ADMIN: GET USERS
========================= */

if($action=="users"){

$result=$conn->query("SELECT id,name,email,role FROM users");

$users=[];

while($row=$result->fetch_assoc()){
$users[]=$row;
}

echo json_encode($users);

}

?>
<?php
// Database connection
$conn = new mysqli('DB_HOST','DB_USER','DB_PASS','DB_NAME');
if($conn->connect_error) die("Database connection failed");

// Build search query
$where = [];
$params = [];

if(!empty($_GET['query'])){
    $q = $conn->real_escape_string($_GET['query']);
    $where[] = "name LIKE '%$q%'";
}
if(!empty($_GET['type'])){
    $t = $conn->real_escape_string($_GET['type']);
    $where[] = "type='$t'";
}
if(!empty($_GET['location'])){
    $l = $conn->real_escape_string($_GET['location']);
    $where[] = "location LIKE '%$l%'";
}

$sql = "SELECT * FROM hospitals";
if(count($where) > 0){
    $sql .= " WHERE ".implode(" AND ", $where);
}
$sql .= " ORDER BY name ASC";

$result = $conn->query($sql);

if($result->num_rows > 0){
    echo "<table>";
    echo "<tr><th>ID</th><th>Name</th><th>Type</th><th>Location</th></tr>";
    while($row = $result->fetch_assoc()){
        echo "<tr>";
        echo "<td>".$row['id']."</td>";
        echo "<td>".$row['name']."</td>";
        echo "<td>".$row['type']."</td>";
        echo "<td>".$row['location']."</td>";
        echo "</tr>";
    }
    echo "</table>";
}else{
    echo "<p>No hospitals found.</p>";
}

$conn->close();
?>
</div>
</body>
</html><?php
/**
 * MyHealth Hospital Backend API
 * PHP API Endpoints for Appointments, Medical Records, and Patient Management
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Simple database simulation (use real database in production)
class HealthcareAPI {
    
    // Handle Appointments
    public static function handleAppointments() {
        $request_method = $_SERVER['REQUEST_METHOD'];
        $data = json_decode(file_get_contents('php://input'), true);
        
        if ($request_method === 'POST') {
            // Book appointment
            $appointment = [
                'id' => uniqid(),
                'doctor' => $data['doctor'] ?? '',
                'date' => $data['date'] ?? '',
                'time' => $data['time'] ?? '',
                'reason' => $data['reason'] ?? '',
                'status' => 'confirmed',
                'created_at' => date('Y-m-d H:i:s')
            ];
            
            return [
                'success' => true,
                'message' => 'Appointment booked successfully',
                'appointment' => $appointment
            ];
        } else if ($request_method === 'GET') {
            // Get appointments
            return [
                'success' => true,
                'appointments' => []
            ];
        }
    }
    
    // Handle Medical Records
    public static function handleMedicalRecords() {
        $request_method = $_SERVER['REQUEST_METHOD'];
        
        if ($request_method === 'GET') {
            return [
                'success' => true,
                'records' => [
                    [
                        'id' => 1,
                        'date' => '2026-01-20',
                        'doctor' => 'Dr. Ahmed Hassan',
                        'diagnosis' => 'Routine Check-up',
                        'notes' => 'Patient is in good health'
                    ]
                ]
            ];
        }
    }
    
    // Handle Drug Interactions
    public static function handleDrugInteractions() {
        $data = json_decode(file_get_contents('php://input'), true);
        $drugs = $data['drugs'] ?? [];
        
        return [
            'success' => true,
            'drugs' => $drugs,
            'interactions' => [],
            'severity' => 'none'
        ];
    }
    
    // Handle User Authentication
    public static function handleAuth() {
        $data = json_decode(file_get_contents('php://input'), true);
        $action = $data['action'] ?? '';
        
        if ($action === 'login') {
            return [
                'success' => true,
                'message' => 'Login successful',
                'token' => bin2hex(random_bytes(32)),
                'user' => [
                    'id' => 1,
                    'email' => $data['email'] ?? '',
                    'name' => 'User Name'
                ]
            ];
        }
        
        return ['success' => false, 'message' => 'Invalid action'];
    }
}

// Route handling
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$endpoint = basename($request_uri);

switch ($endpoint) {
    case 'appointments.php':
        echo json_encode(HealthcareAPI::handleAppointments());
        break;
    case 'records.php':
        echo json_encode(HealthcareAPI::handleMedicalRecords());
        break;
    case 'drugs.php':
        echo json_encode(HealthcareAPI::handleDrugInteractions());
        break;
    case 'auth.php':
        echo json_encode(HealthcareAPI::handleAuth());
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
}
?>
