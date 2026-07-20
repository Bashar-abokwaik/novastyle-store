import styles from "./adminHeader.module.css";

interface Props {
  onAddClick: () => void;
  pageName: string;
}

// This component is used to display the header for the admin pages. 
// It takes in two props: onAddClick, which is a function that will be called when the "Add New" button is clicked,
//  and pageName, which is a string that represents the name of the current page (e.g., "Category", "Collection", etc.). 

export default function AdminHeader({ onAddClick, pageName }: Props) {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>{pageName}</h1>
        <p className={styles.subtitle}>
          Manage your store {pageName.toLowerCase()}
        </p>
      </div>

      <button className={styles.button} onClick={onAddClick}>
        + Add New {pageName}
      </button>
    </div>
  );
}
