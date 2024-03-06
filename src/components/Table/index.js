import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import CheckIcon from "@mui/icons-material/Check";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import CircularProgress from "@mui/material/CircularProgress";
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "../../utils/configAxios";
const REACT_APP_URL_BIBLIOTECA_RUNNERS =
  process.env.REACT_APP_URL_BIBLIOTECA_RUNNERS;

function createData(id, name, calories, fat, carbs, protein) {
  return {
    id,
    name,
    calories,
    fat,
    carbs,
    protein,
  };
}

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

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    headCells,
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
            sx={{
              whiteSpace: headCell.whiteSpace ? "pre-wrap" : "normal",
              minWidth: headCell.width,
              overflow: "clip",
            }}
            onClick={() => {}}
            align={
              headCell.align === "right" || headCell.numeric ? "right" : "left"
            }
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const handleCheckPresent = async (selectedRows, rows) => {
  try {
    console.log("tt", selectedRows);
    const data = selectedRows.map((numLinha) => rows[numLinha].TRANSACAO);
    await axios.post(
      `${REACT_APP_URL_BIBLIOTECA_RUNNERS}/v1/evento/marcar-presenca`,
      { transacoes: data, status: "approved" }
    );
  } catch (error) {}
};

function EnhancedTableToolbar(props) {
  const {
    numSelected,
    label,
    valueSearch,
    setValueSearch,
    handleSearch,
    selected,
    rows,
  } = props;

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
          variant="subtitle1"
          color="textSecondary"
          component="div"
        >
          {numSelected > 1
            ? `${numSelected} linhas selecionadas`
            : `${numSelected} linha selecionada`}
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {label}
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Marcar como presente">
          <IconButton onClick={() => handleCheckPresent(selected, rows)}>
            <CheckIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <TextField
          placeholder="Pesquisar"
          variant="outlined"
          size="small"
          value={valueSearch}
          onChange={(e) => setValueSearch(e.target.value)}
          InputProps={{
            type: "search",
            endAdornment: (
              <Tooltip title="Pesquisar">
                <IconButton onClick={handleSearch} size="small">
                  <SearchIcon />
                </IconButton>
              </Tooltip>
            ),
          }}
        />
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable({ rows, headCells, label }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [loading, setLoading] = React.useState(false);
  const [valueSearch, setValueSearch] = React.useState("");
  const [filteredRows, setFilteredRows] = React.useState(rows);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSearch = () => {
    if (rows && rows.length > 0) {
      const filteredRows = rows.filter((row) =>
        Object.values(row).some((value) =>
          value.toString().toLowerCase().includes(valueSearch.toLowerCase())
        )
      );
      setFilteredRows(filteredRows);
      setPage(0);
    }
  };

  React.useEffect(() => {
    !valueSearch && handleSearch();
  }, [valueSearch]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filteredRows.map((n, index) => index);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleClick = (event, id) => {
    console.log(id);
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

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(filteredRows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage]
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }} variant="outlined">
        <EnhancedTableToolbar
          rows={rows}
          selected={selected}
          numSelected={selected.length}
          label={label}
          valueSearch={valueSearch}
          setValueSearch={setValueSearch}
          handleSearch={handleSearch}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              headCells={headCells}
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
                  <TableCell colSpan={headCells.length + 1} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows.map((row, index) => {
                  const isItemSelected = isSelected(row); // Verificar se a linha está selecionada

                  return (
                    <>
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, index)} // Selecionar a linha clicada
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
                            checked={isSelected(index)}
                            onChange={(event) => handleClick(event, index)}
                          />
                        </TableCell>
                        {headCells.map((headCell, index) => (
                          <TableCell
                            key={index}
                            align={headCell.numeric ? "right" : "left"}
                            sx={{
                              whiteSpace: headCell.whiteSpace
                                ? "pre-wrap"
                                : "normal",
                              padding: "0 5px",
                              overflow: "clip",
                              maxWidth: headCell.width,
                              background: index % 2 === 0 ? "#f9f9f9" : "#fff",
                            }}
                          >
                            {headCell.more
                              ? row[headCell.id].toString().replace("//", "\n")
                              : row[headCell.id]}
                          </TableCell>
                        ))}
                      </TableRow>
                    </>
                  );
                })
              )}

              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={headCells.length + 1} />
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
        label="Reduzir espaçamento"
      />
    </Box>
  );
}
