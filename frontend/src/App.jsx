import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Landing from './pages/Landing';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';

// Patient Pages
import PatientDashboard from './pages/patient/Dashboard';
import SymptomChecker from './pages/patient/SymptomChecker';
import HealthPrediction from './pages/patient/HealthPrediction';
import HospitalFinder from './pages/patient/HospitalFinder';
import Appointments from './pages/patient/Appointments';
import HealthRecords from './pages/patient/HealthRecords';
import Chatbot from './pages/patient/Chatbot';
import Emergency from './pages/patient/Emergency';
import MedicineReminder from './pages/patient/MedicineReminder';
import Profile from './pages/patient/Profile';

// Doctor Pages
import DoctorDashboard from './pages/doctor/Dashboard';
import DoctorAppointments from './pages/doctor/Appointments';
import DoctorPatients from './pages/doctor/Patients';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminHospitals from './pages/admin/Hospitals';
import DoctorApprovals from './pages/admin/DoctorApprovals';

// Protected Route Component
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center gradient-hero">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-white text-lg font-medium">Loading MediAI...</p>
    </div>
  </div>
);

function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{
        duration: 3000,
        style: { borderRadius: '12px', background: '#1e293b', color: '#f8fafc', padding: '16px' }
      }} />
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Patient Routes */}
        <Route path="/patient" element={<ProtectedRoute roles={['patient']}><DashboardLayout role="patient" /></ProtectedRoute>}>
          <Route index element={<PatientDashboard />} />
          <Route path="symptoms" element={<SymptomChecker />} />
          <Route path="predict" element={<HealthPrediction />} />
          <Route path="hospitals" element={<HospitalFinder />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="records" element={<HealthRecords />} />
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="emergency" element={<Emergency />} />
          <Route path="reminders" element={<MedicineReminder />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Doctor Routes */}
        <Route path="/doctor" element={<ProtectedRoute roles={['doctor']}><DashboardLayout role="doctor" /></ProtectedRoute>}>
          <Route index element={<DoctorDashboard />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="patients" element={<DoctorPatients />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><DashboardLayout role="admin" /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="hospitals" element={<AdminHospitals />} />
          <Route path="doctors" element={<DoctorApprovals />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
