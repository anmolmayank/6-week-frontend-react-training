/**
 * ============================================================================
 * Tenant Table
 * ============================================================================
 */

import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import {
  useDownloadAgreementMutation,
  useGetTenantsQuery,
  useUploadAgreementMutation,
  useDeleteAgreementMutation
} from "../api";

import TenantTableRow from "./TenantTableRow";

const TenantTable = () => {
  /**
   * ------------------------------------------------------------------------
   * Queries
   * ------------------------------------------------------------------------
   */
  const { data, isLoading, isError } = useGetTenantsQuery();

  /**
   * ------------------------------------------------------------------------
   * Mutations
   * ------------------------------------------------------------------------
   */
  const [uploadAgreement, { isLoading: isUploading }] =
    useUploadAgreementMutation();

  const [downloadAgreement] = useDownloadAgreementMutation();

  const [deleteAgreement] = useDeleteAgreementMutation();

  /**
   * ------------------------------------------------------------------------
   * Event Handlers
   * ------------------------------------------------------------------------
   */
  const handleUpload = async (tenantId: string, file: File) => {
    try {
      await uploadAgreement({
        tenantId,
        file,
      }).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReplace = async (tenantId: string, file: File) => {
    await handleUpload(tenantId, file);
  };

  const handleDelete = async (tenantId: string) => {
    try {
      await deleteAgreement(tenantId).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = async (tenantId: string) => {
    try {
      const blob = await downloadAgreement(tenantId).unwrap();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = "RentalAgreement.pdf";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * ------------------------------------------------------------------------
   * Loading
   * ------------------------------------------------------------------------
   */
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 5,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  /**
   * ------------------------------------------------------------------------
   * Error
   * ------------------------------------------------------------------------
   */
  if (isError) {
    return <Alert severity="error">Failed to load tenants.</Alert>;
  }

  /**
   * ------------------------------------------------------------------------
   * Empty
   * ------------------------------------------------------------------------
   */
  if (!data || data.data.length === 0) {
    return (
      <Paper sx={{ p: 4 }}>
        <Typography align="center">No tenants found.</Typography>
      </Paper>
    );
  }

  /**
   * ------------------------------------------------------------------------
   * Render
   * ------------------------------------------------------------------------
   */
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tenant</TableCell>
            <TableCell>Apartment</TableCell>
            <TableCell align="right">Monthly Rent</TableCell>
            <TableCell>Agreement</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.data.map((tenant) => (
            <TenantTableRow
              key={tenant._id}
              tenant={tenant}
              onUpload={(file) => handleUpload(tenant._id, file)}
              onReplace={(file) => handleReplace(tenant._id, file)}
              onDelete={() => handleDelete(tenant._id)}
              onDownload={() => handleDownload(tenant._id)}
              isUploading={isUploading}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TenantTable;
