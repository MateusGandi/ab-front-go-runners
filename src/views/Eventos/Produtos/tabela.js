import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "../../../utils/configAxios";
import {
  alpha,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Checkbox,
  IconButton,
  Tooltip,
  FormControlLabel,
  Switch,
  CircularProgress,
  MenuItem,
  Select,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

const REACT_APP_URL_BIBLIOTECA_RUNNERS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS;

const headCells = [
  {
    id: "nomeProduto",
    numeric: false,
    disablePadding: false,
    label: "Produto",
  },
  {
    id: "preco",
    numeric: true,
    disablePadding: false,
    label: "Preço (R$)",
  },
  {
    id: "variacoes",
    numeric: false,
    disablePadding: false,
    label: "Variações",
  },
  {
    id: "quantidade",
    numeric: true,
    disablePadding: false,
    label: "Quantidade",
  },
  {
    id: "tabela",
    numeric: false,
    disablePadding: false,
    label: "Tabela",
  },
  {
    id: "percentual",
    numeric: true,
    disablePadding: false,
    label: "Max Desconto (%)",
  },
  {
    id: "custo",
    numeric: true,
    disablePadding: false,
    label: "Custo (R$)",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
  },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const EnhancedTableHead = (props) => {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell, index) => (
          <TableCell
            key={index}
            align="center"
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = ({
  numSelected,
  handleDelete,
  handleEdit,
  tabelas,
  selectedTabela,
  setSelectedTabela,
}) => {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selecionado
        </Typography>
      ) : (
        <>
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Produtos
          </Typography>
          {tabelas.length > 0 ? (
            <FormControl
              variant="standard"
              style={{ margin: 2, minWidth: 220 }}
            >
              <InputLabel id="demo-simple-select-standard-label">
                Tabela de preço
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={selectedTabela}
                onChange={(e) => setSelectedTabela(e.target.value)}
                label="Tabela de preço"
              >
                {tabelas.map((tabela, index) => (
                  <MenuItem key={index} value={tabela}>
                    {tabela}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : null}
        </>
      )}
      {numSelected == 1 && (
        <Tooltip title="Editar" onClick={handleEdit}>
          <IconButton>
            <ModeEditIcon />
          </IconButton>
        </Tooltip>
      )}
      {numSelected > 0 && (
        <Tooltip title="Excluir" onClick={handleDelete}>
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  tabelas: PropTypes.array.isRequired,
  selectedTabela: PropTypes.string.isRequired,
  setSelectedTabela: PropTypes.func.isRequired,
};

//principal
const EnhancedTable = ({
  alertCustom,
  tabelas,
  setItemToEdit,
  resetPage,
  openModal,
  closeModal,
}) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("nomeProduto");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTabela, setSelectedTabela] = useState(tabelas[0] || "");

  useEffect(() => {
    const fetchProdutos = async () => {
      if (selectedTabela !== "") {
        console.log(selectedTabela, tabelas.includes(selectedTabela));
        try {
          setLoading(true);
          const response = await axios.get(
            `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/produto/buscar-tabela/${selectedTabela}`
          );
          setRows(response.data);
          setLoading(false);
        } catch (error) {
          alertCustom("Erro ao buscar dados dos produtos");
          console.error("Erro ao buscar dados dos produtos:", error);
          setLoading(false);
        }
      } else {
        setSelectedTabela(tabelas[0] || "");
      }
    };

    fetchProdutos();
  }, [selectedTabela, tabelas]);

  const handleDelete = async () => {
    if (selected.length === 0) {
      return;
    }
    try {
      const response = await axios.delete(
        `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/produto/remover-produtos`,
        { data: { ids: selected } }
      );
      resetPage(true);
      alertCustom("Itens removidos com sucesso");

      const updatedRows = rows.filter(
        (row) => !selected.includes(row.produto.id)
      );
      setSelected([]);
      setRows(updatedRows);
    } catch (error) {
      alertCustom("Erro ao excluir itens");
      console.error("Erro ao excluir itens:", error);
    }
  };

  const handleEdit = () => {
    if (selected.length > 1) {
      return;
    }
    const rowToUpdate = rows.filter((row) => selected.includes(row.produto.id));
    openModal("editProduto");
    setItemToEdit(rowToUpdate[0]);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, rows]
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }} variant="outlined">
        <EnhancedTableToolbar
          numSelected={selected.length}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          tabelas={tabelas}
          selectedTabela={selectedTabela}
          setSelectedTabela={setSelectedTabela}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={12} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.produto.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.produto.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={index}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        align="left"
                        id={labelId}
                        scope="row"
                        style={{ background: "rgba(0, 0, 0, 0.02)" }}
                      >
                        {row.produto.nomeProduto}
                      </TableCell>
                      <TableCell align="right">{row.preco}</TableCell>
                      <TableCell
                        align="center"
                        style={{ background: "rgba(0, 0, 0, 0.02)" }}
                      >
                        {row.produto.variacoes.map((variacao) => {
                          return `${variacao} `;
                        })}
                      </TableCell>
                      <TableCell align="right">
                        {row.produto.quantidade}
                      </TableCell>
                      <TableCell
                        align="left"
                        style={{ background: "rgba(0, 0, 0, 0.02)" }}
                      >
                        {row.nomeTabela}
                      </TableCell>
                      <TableCell align="right">
                        {row.percentualDesconto}
                      </TableCell>

                      <TableCell
                        align="right"
                        style={{ background: "rgba(0,0, 0, 0.02)" }}
                      >
                        {row.produto.custo}
                      </TableCell>
                      <TableCell align="center">
                        <spam
                          style={{
                            padding: "1px 5px",
                            borderRadius: "5px",
                            color: "#fff",
                            backgroundColor: row.produto.status
                              ? "green"
                              : "red",
                          }}
                        >
                          {row.produto.status ? "Ativo" : "Inativo"}
                        </spam>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
              {emptyRows > 0 && !loading && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Reduzir espaçamento para visualização massiva"
      />
    </Box>
  );
};

export default EnhancedTable;
