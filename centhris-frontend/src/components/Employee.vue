<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useEmployeeStore } from '../stores/employee.store'

const employeeStore = useEmployeeStore()

const showErrorModal = ref(false)

onMounted(async () => {
  await employeeStore.getEmployees('', 1)

  if (employeeStore.apiFailedAfterRetries) {
    showErrorModal.value = true
  }
})

const useMockData = () => {
  employeeStore.loadSampleEmployees()
  showErrorModal.value = false
}
</script>

<template>
  <div class="page-container">
    <h1 class="title">Cent HRIS</h1>

    <!-- Loading -->
    <div v-if="employeeStore.loading" class="status-message">
      Loading employees...
    </div>

    <!-- Employee Grid -->
    <div class="employee-grid">
      <div
        v-for="employee in employeeStore.employees"
        :key="employee.id"
        class="employee-card"
      >
        <h3>{{ employee.first_name }} {{ employee.last_name }}</h3>
        <p>{{ employee.position }}</p>
        <small>{{ employee.email }}</small>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="employeeStore.pagination.last_page" class="pagination">
      Page {{ employeeStore.pagination.current_page }}
      of {{ employeeStore.pagination.last_page }}
    </div>

    <!-- Modal -->
    <div v-if="showErrorModal" class="modal-overlay">
      <div class="modal">
        <h2>API Error</h2>
        <p>
          The API failed 3 times. Would you like to load temporary mock data?
        </p>
        <button @click="useMockData">Load Sample Data</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  padding: 20px;
  max-width: 1200px;
  margin: auto;
}

.title {
  text-align: center;
  margin-bottom: 20px;
}

.status-message {
  text-align: center;
  margin: 20px 0;
}

.employee-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.employee-card {
  background: #ffffff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;
}

.employee-card:hover {
  transform: translateY(-5px);
}

.employee-card h3 {
  margin: 0 0 8px;
}

.employee-card p {
  margin: 0 0 5px;
  color: #555;
}

.employee-card small {
  color: #888;
}

/* Pagination */
.pagination {
  margin-top: 20px;
  text-align: center;
  font-weight: bold;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 25px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  text-align: center;
}

.modal button {
  margin-top: 15px;
  padding: 8px 15px;
  border: none;
  background-color: #3b82f6;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}

.modal button:hover {
  background-color: #2563eb;
}
</style>
