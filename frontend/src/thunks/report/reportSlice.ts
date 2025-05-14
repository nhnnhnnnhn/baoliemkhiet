import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/src/store';
import { Report } from '@/src/apis/report';
import {
  handleGetAllReports,
  handleGetReportById,
  handleGetReportsByArticleId,
  handleGetReportsByCommentId,
  handleEditReport,
  handleDeleteReport,
  handleDeleteMultipleReports,
  handleCreateArticleReport
} from './reportThunk';

interface ReportState {
  reports: Report[];
  selectedReport: Report | null;
  filteredReports: Report[];
  isLoading: boolean;
  error: string | null;
  
  // Edit report state
  isEditingReport: boolean;
  editReportError: string | null;
  editReportSuccess: boolean;
  
  // Delete report state
  isDeletingReport: boolean;
  deleteReportError: string | null;
  deleteReportSuccess: boolean;
  
  // Delete multiple reports state
  isDeletingMultipleReports: boolean;
  deleteMultipleReportsError: string | null;
  deleteMultipleReportsSuccess: boolean;
  
  // Create report state
  isCreatingReport: boolean;
  createReportError: string | null;
  createReportSuccess: boolean;
  
  // Selected report IDs for batch operations
  selectedReportIds: number[];
}

const initialState: ReportState = {
  reports: [],
  selectedReport: null,
  filteredReports: [],
  isLoading: false,
  error: null,
  
  // Edit report state
  isEditingReport: false,
  editReportError: null,
  editReportSuccess: false,
  
  // Delete report state
  isDeletingReport: false,
  deleteReportError: null,
  deleteReportSuccess: false,
  
  // Delete multiple reports state
  isDeletingMultipleReports: false,
  deleteMultipleReportsError: null,
  deleteMultipleReportsSuccess: false,
  
  // Create report state
  isCreatingReport: false,
  createReportError: null,
  createReportSuccess: false,
  
  // Selected report IDs for batch operations
  selectedReportIds: [],
};

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedReport: (state, action: PayloadAction<Report>) => {
      state.selectedReport = action.payload;
    },
    clearSelectedReport: (state) => {
      state.selectedReport = null;
    },
    setSelectedReportIds: (state, action: PayloadAction<number[]>) => {
      state.selectedReportIds = action.payload;
    },
    addSelectedReportId: (state, action: PayloadAction<number>) => {
      if (!state.selectedReportIds.includes(action.payload)) {
        state.selectedReportIds.push(action.payload);
      }
    },
    removeSelectedReportId: (state, action: PayloadAction<number>) => {
      state.selectedReportIds = state.selectedReportIds.filter(id => id !== action.payload);
    },
    clearSelectedReportIds: (state) => {
      state.selectedReportIds = [];
    },
    clearEditReportState: (state) => {
      state.editReportError = null;
      state.editReportSuccess = false;
    },
    clearDeleteReportState: (state) => {
      state.deleteReportError = null;
      state.deleteReportSuccess = false;
    },
    clearDeleteMultipleReportsState: (state) => {
      state.deleteMultipleReportsError = null;
      state.deleteMultipleReportsSuccess = false;
    },
    clearCreateReportState: (state) => {
      state.createReportError = null;
      state.createReportSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all reports
      .addCase(handleGetAllReports.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGetAllReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reports = action.payload;
      })
      .addCase(handleGetAllReports.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Get report by ID
      .addCase(handleGetReportById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGetReportById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedReport = action.payload;
      })
      .addCase(handleGetReportById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Get reports by article ID
      .addCase(handleGetReportsByArticleId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGetReportsByArticleId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.filteredReports = action.payload;
      })
      .addCase(handleGetReportsByArticleId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Get reports by comment ID
      .addCase(handleGetReportsByCommentId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGetReportsByCommentId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.filteredReports = action.payload;
      })
      .addCase(handleGetReportsByCommentId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Edit report
      .addCase(handleEditReport.pending, (state) => {
        state.isEditingReport = true;
        state.editReportError = null;
        state.editReportSuccess = false;
      })
      .addCase(handleEditReport.fulfilled, (state, action) => {
        state.isEditingReport = false;
        state.editReportSuccess = true;
        
        // Update the report in reports array
        state.reports = state.reports.map(report => 
          report.id === action.payload.id ? action.payload : report
        );
        
        // Update in filtered reports if exists
        state.filteredReports = state.filteredReports.map(report => 
          report.id === action.payload.id ? action.payload : report
        );
        
        // Update selected report if it's the edited one
        if (state.selectedReport?.id === action.payload.id) {
          state.selectedReport = action.payload;
        }
      })
      .addCase(handleEditReport.rejected, (state, action) => {
        state.isEditingReport = false;
        state.editReportError = action.payload as string;
        state.editReportSuccess = false;
      })
      
      // Delete report
      .addCase(handleDeleteReport.pending, (state) => {
        state.isDeletingReport = true;
        state.deleteReportError = null;
        state.deleteReportSuccess = false;
      })
      .addCase(handleDeleteReport.fulfilled, (state, action) => {
        state.isDeletingReport = false;
        state.deleteReportSuccess = true;
        
        // Remove the report from reports array
        state.reports = state.reports.filter(report => report.id !== action.payload);
        
        // Remove from filtered reports
        state.filteredReports = state.filteredReports.filter(report => report.id !== action.payload);
        
        // Clear selected report if it's the deleted one
        if (state.selectedReport?.id === action.payload) {
          state.selectedReport = null;
        }
        
        // Remove from selected report IDs if exists
        state.selectedReportIds = state.selectedReportIds.filter(id => id !== action.payload);
      })
      .addCase(handleDeleteReport.rejected, (state, action) => {
        state.isDeletingReport = false;
        state.deleteReportError = action.payload as string;
        state.deleteReportSuccess = false;
      })
      
      // Delete multiple reports
      .addCase(handleDeleteMultipleReports.pending, (state) => {
        state.isDeletingMultipleReports = true;
        state.deleteMultipleReportsError = null;
        state.deleteMultipleReportsSuccess = false;
      })
      .addCase(handleDeleteMultipleReports.fulfilled, (state, action) => {
        state.isDeletingMultipleReports = false;
        state.deleteMultipleReportsSuccess = true;
        
        const deletedIds = action.payload as number[];
        
        // Remove the reports from reports array
        state.reports = state.reports.filter(report => !deletedIds.includes(report.id));
        
        // Remove from filtered reports
        state.filteredReports = state.filteredReports.filter(report => !deletedIds.includes(report.id));
        
        // Clear selected report if it's one of the deleted ones
        if (state.selectedReport && deletedIds.includes(state.selectedReport.id)) {
          state.selectedReport = null;
        }
        
        // Clear selected report IDs
        state.selectedReportIds = state.selectedReportIds.filter(id => !deletedIds.includes(id));
      })
      .addCase(handleDeleteMultipleReports.rejected, (state, action) => {
        state.isDeletingMultipleReports = false;
        state.deleteMultipleReportsError = action.payload as string;
        state.deleteMultipleReportsSuccess = false;
      })
      
      // Create article report
      .addCase(handleCreateArticleReport.pending, (state) => {
        state.isCreatingReport = true;
        state.createReportError = null;
        state.createReportSuccess = false;
      })
      .addCase(handleCreateArticleReport.fulfilled, (state, action) => {
        state.isCreatingReport = false;
        state.createReportSuccess = true;
        
        // Add new report to reports array
        state.reports.push(action.payload);
        
        // Add to filtered reports if for the same article
        if (state.filteredReports.length > 0 && 
            (state.filteredReports[0].articleId === action.payload.articleId ||
             state.filteredReports[0].commentId === action.payload.commentId)) {
          state.filteredReports.push(action.payload);
        }
      })
      .addCase(handleCreateArticleReport.rejected, (state, action) => {
        state.isCreatingReport = false;
        state.createReportError = action.payload as string;
        state.createReportSuccess = false;
      });
  }
});

// Export actions
export const {
  clearError,
  setSelectedReport,
  clearSelectedReport,
  setSelectedReportIds,
  addSelectedReportId,
  removeSelectedReportId,
  clearSelectedReportIds,
  clearEditReportState,
  clearDeleteReportState,
  clearDeleteMultipleReportsState,
  clearCreateReportState
} = reportSlice.actions;

// Export selectors
export const selectReports = (state: RootState) => state.report.reports;
export const selectSelectedReport = (state: RootState) => state.report.selectedReport;
export const selectFilteredReports = (state: RootState) => state.report.filteredReports;
export const selectIsLoading = (state: RootState) => state.report.isLoading;
export const selectError = (state: RootState) => state.report.error;
export const selectSelectedReportIds = (state: RootState) => state.report.selectedReportIds;

// Edit report selectors
export const selectIsEditingReport = (state: RootState) => state.report.isEditingReport;
export const selectEditReportError = (state: RootState) => state.report.editReportError;
export const selectEditReportSuccess = (state: RootState) => state.report.editReportSuccess;

// Delete report selectors
export const selectIsDeletingReport = (state: RootState) => state.report.isDeletingReport;
export const selectDeleteReportError = (state: RootState) => state.report.deleteReportError;
export const selectDeleteReportSuccess = (state: RootState) => state.report.deleteReportSuccess;

// Delete multiple reports selectors
export const selectIsDeletingMultipleReports = (state: RootState) => state.report.isDeletingMultipleReports;
export const selectDeleteMultipleReportsError = (state: RootState) => state.report.deleteMultipleReportsError;
export const selectDeleteMultipleReportsSuccess = (state: RootState) => state.report.deleteMultipleReportsSuccess;

// Create report selectors
export const selectIsCreatingReport = (state: RootState) => state.report.isCreatingReport;
export const selectCreateReportError = (state: RootState) => state.report.createReportError;
export const selectCreateReportSuccess = (state: RootState) => state.report.createReportSuccess;

export default reportSlice.reducer; 