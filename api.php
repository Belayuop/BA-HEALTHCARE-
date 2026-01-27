<?php
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
