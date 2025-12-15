import { useState } from "react";
import styles from "./Users.module.scss";
import classNames from "classnames/bind";
import { useAdminUsers } from "~/features/users/hooks/useAdminUsers";
import ConfirmModal from "~/components/common/ConfirmModal";

const cx = classNames.bind(styles);

export default function AdminUsers() {
  const {
    filteredUsers,
    pagination,
    q,
    setQ,
    loading,
    error,

    selectedIds,
    toggleSelect,
    toggleSelectAll,
    isAllSelected,

    changeStatusMany,

    page,
    goPrev,
    goNext,
    canPrev,
    canNext,

    notice,
    setNotice,
  } = useAdminUsers();

  const [bulkAction, setBulkAction] = useState("");


  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingActive, setPendingActive] = useState(null); // true/false
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleApplyBulk = () => {
    if (!bulkAction) return;

    if (selectedIds.length === 0) {
      // bạn có thể đổi thành toast sau
      setNotice?.({ type: "error", text: "Bạn chưa chọn user nào" });
      return;
    }

    // set action cần confirm
    if (bulkAction === "activate") setPendingActive(true);
    if (bulkAction === "deactivate") setPendingActive(false);

    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setConfirmLoading(true);
    try {
      await changeStatusMany(pendingActive);
      setConfirmOpen(false);
      setBulkAction("");
      setPendingActive(null);
    } catch (e) {
      console.log(e)
      // notice lỗi đã được set trong hook rồi
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <div className={cx("page")}>
      <div className={cx("top")}>
        <h2>Quản lý người dùng</h2>

        <div className={cx("rightTop")}>
          <div className={cx("searchBox")}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm theo tên, email, role..."
            />
          </div>

          {pagination && (
            <span className={cx("meta")}>
              Tổng: {pagination.total} user • Trang {pagination.page}/{pagination.totalPages}
            </span>
          )}
        </div>
      </div>


      {notice && (
  <div className={cx("toast", notice.type)}>
    <span className={cx("toastText")}>{notice.text}</span>

    <button
      type="button"
      className={cx("toastClose")}
      onClick={() => setNotice(null)}
      aria-label="Close"
    >
      ×
    </button>
  </div>
)}


      {/* Bulk actions */}
      <div className={cx("bulkActions")}>
        <span>
          Đã chọn: <strong>{selectedIds.length}</strong>
        </span>

        <div className={cx("bulkButtons")}>
          <select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            className={cx("select")}
          >
            <option value="">-- Chọn thao tác --</option>
            <option value="activate">Mở hoạt động</option>
            <option value="deactivate">Khóa</option>
          </select>

          <button
            className={cx("btnSmall")}
            onClick={handleApplyBulk}
            disabled={!bulkAction || selectedIds.length === 0}
          >
            Áp dụng
          </button>
        </div>
      </div>

      {loading && <div className={cx("state")}>Đang tải user...</div>}
      {error && <div className={cx("state", "error")}>{error}</div>}

      {!loading && !error && (
        <>
          <div className={cx("tableWrap")}>
            <table className={cx("table")}>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>#</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={7} className={cx("empty")}>
                      Không có user nào
                    </td>
                  </tr>
                )}

                {filteredUsers.map((u, idx) => {
                  const id = u._id || u.id;
                  const name = u.fullName || u.name || "(chưa có tên)";
                  const role = u.role || "USER";
                  const status = u.isActive ? "Hoạt động" : "Đã khóa";
                  const checked = selectedIds.includes(id);

                  return (
                    <tr key={id || idx}>
                      <td>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleSelect(id)}
                        />
                      </td>
                      <td>{idx + 1}</td>
                      <td>{name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={cx("role", role.toLowerCase())}>
                          {role}
                        </span>
                      </td>
                      <td>
                        <span className={cx("status", u.isActive ? "on" : "off")}>
                          {status}
                        </span>
                      </td>
                      <td>
                        <div className={cx("actions")}>
                          <button className={cx("btn")}>Xem</button>
                          <button className={cx("btnOutline")}>Sửa</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {pagination && (
            <div className={cx("pagination")}>
              <button onClick={goPrev} disabled={!canPrev}>
                &laquo; Trang trước
              </button>
              <span>
                Trang <strong>{page}</strong> / {pagination.totalPages}
              </span>
              <button onClick={goNext} disabled={!canNext}>
                Trang sau &raquo;
              </button>
            </div>
          )}
        </>
      )}


      <ConfirmModal
        open={confirmOpen}
        title="Xác nhận"
        message={`Bạn có chắc muốn ${pendingActive ? "MỞ hoạt động" : "KHÓA"} ${selectedIds.length} user?`}
        confirmText="Xác nhận"
        cancelText="Hủy"
        loading={confirmLoading}
        onCancel={() => {
          setConfirmOpen(false);
          setPendingActive(null);
        }}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
