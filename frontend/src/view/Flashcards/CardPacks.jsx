import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Typography,
    Box,
    InputBase,
    Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import flashcardAPI from "../../config/flashcardAPI";

const CardPacks = () => {
    const [cardPacks, setCardPacks] = useState([]);
    const [filteredCardPacks, setFilteredCardPacks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCardPacks = async () => {
            try {
                const { data } = await flashcardAPI.get("/packs", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setCardPacks(data);
                setFilteredCardPacks(data);
            } catch (err) {
                console.error(err);
                alert("Error fetching card packs");
            }
        };

        fetchCardPacks();
    }, []);

    const handleSearch = (event) => {
        const searchValue = event.target.value.toLowerCase();
        setSearchTerm(searchValue);

        const filtered = cardPacks.filter((pack) =>
            pack.name.toLowerCase().includes(searchValue)
        );
        setFilteredCardPacks(filtered);
    };

    const handleDelete = async (packId) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                await flashcardAPI.delete(`/packs/${packId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });

                setCardPacks((prevPacks) => prevPacks.filter((pack) => pack.id !== packId));
                setFilteredCardPacks((prevPacks) => prevPacks.filter((pack) => pack.id !== packId));

                Swal.fire("Deleted!", "Your card pack has been deleted.", "success");
            } catch (err) {
                console.error(err);
                Swal.fire("Error!", "There was an error deleting the card pack.", "error");
            }
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#0A3981" }}>
                Card Packs
            </Typography>

            {/* Search Bar */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#E8F0FE",
                    borderRadius: "24px",
                    p: 1,
                    mb: 3,
                    border: "2px solid #0A3981",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                <SearchIcon sx={{ color: "#0A3981", mr: 2, fontSize: "24px" }} />
                <InputBase
                    placeholder="Search card packs..."
                    onChange={handleSearch}
                    sx={{
                        flex: 1,
                        fontSize: "16px",
                        color: "#333",
                    }}
                />
            </Box>

            {/* Card Packs Table */}
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: "#0A3981" }}>
                        <TableRow>
                            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Card Pack Name</TableCell>
                            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Cards</TableCell>
                            <TableCell sx={{ color: "#fff", fontWeight: "bold" }} align="center">
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredCardPacks.map((pack) => (
                            <TableRow key={pack.id} hover>
                                <TableCell>
                                    <Typography variant="body1" sx={{ color: "#0D47A1", fontWeight: "bold" }}>
                                        {pack.name || "Untitled Pack"}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="textSecondary">
                                        {pack.card_count || 0} cards
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        color="primary"
                                        onClick={() => navigate(`/cards/${pack.id}`)}
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(pack.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default CardPacks;
