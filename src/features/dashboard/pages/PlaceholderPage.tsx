import { Box, Paper, Typography } from "@mui/material";
import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";

type PlaceholderPageProps = Readonly<{
  title: string;
  description: string;
}>;

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <Paper elevation={0} sx={{ minHeight: 300, display: "grid", placeItems: "center", p: 4, textAlign: "center", border: "1px solid #E6ECF3", borderRadius: 3 }}>
      <Box>
        <ConstructionOutlinedIcon sx={{ fontSize: 42, color: "#8195AB" }} />
        <Typography variant="h5" sx={{ mt: 1.5, fontWeight: 750, color: "#142844" }}>{title}</Typography>
        <Typography sx={{ mt: 0.75, maxWidth: 520, lineHeight: 1.7, color: "text.secondary", fontSize: 13 }}>{description}</Typography>
      </Box>
    </Paper>
  );
}
