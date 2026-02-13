import { defineStore } from 'pinia'
import { apiClient } from '../services/api.service'

// type definitiosn
export interface Employee {
  id: number
  first_name: string
  last_name: string
  email: string
  position: string
}

export interface Pagination {
  current_page: number
  per_page: number
  total: number
  last_page: number
}

// Pinia store
export const useEmployeeStore = defineStore('employee', {
  state: () => ({
    employees: [] as Employee[],
    pagination: {} as Pagination,
    loading: false,
    error: null as string | null,
    apiFailedAfterRetries: false as boolean // 👈 track API failures
  }),

  actions: {
    // fetching of emps
    async getEmployees(
      search: string = '',
      page: number = 1,
      perPage: number = 10
    ): Promise<void> {
      this.loading = true
      this.error = null
      this.apiFailedAfterRetries = false

      const maxRetryAttempts = 3
      const retryDelayMs = 1000
      let attempt = 0

      while (attempt < maxRetryAttempts) {
        try {
          const response = await apiClient.get('/api/employees', {
            params: {
              search,
              page,
              per_page: perPage
            }
          })

          const responseData = response.data

          this.employees = responseData.data
          this.pagination = {
            current_page: responseData.current_page,
            per_page: responseData.per_page,
            total: responseData.total,
            last_page: responseData.last_page
          }

          this.loading = false
          return
        } catch (err: any) {
          attempt++

          if (attempt >= maxRetryAttempts) {
            console.warn('API failed after 3 attempts.')
            this.apiFailedAfterRetries = true
            this.loading = false
            return
          }

          // wait before retrying
          await new Promise(resolve => setTimeout(resolve, retryDelayMs))
        }
      }

      this.loading = false
    },

    /**
     * Load this sample data only when:
     * -> API failed 3 times
     * 
     * just to makesure that the front end is working
     */
    loadSampleEmployees(perPage: number = 10) {
      this.employees = [
        {
          id: 1,
          first_name: 'Juan',
          last_name: 'Dela Cruz',
          email: 'email@email.com',
          position: 'Software Engineering Head'
        },
        {
          id: 2,
          first_name: 'Maria',
          last_name: 'Santos',
          email: 'email@email.com',
          position: 'Senior Software Engineer'
        },
        {
          id: 3,
          first_name: 'Carlos',
          last_name: 'Reyes',
          email: 'email@email.com',
          position: 'Junior Software Engineer'
        }
      ]

      this.pagination = {
        current_page: 1,
        per_page: perPage,
        total: 3,
        last_page: 1
      }

      this.apiFailedAfterRetries = false
      this.loading = false
      this.error = null
    }
  }
})
