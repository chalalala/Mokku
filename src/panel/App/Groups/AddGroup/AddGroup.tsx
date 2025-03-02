import React from "react";
import { SideDrawer } from "../../Blocks/SideDrawer";
import { useChromeStore, useMockStoreSelector } from "../../store/useMockStore";
import { AddGroupForm } from "./AddGroup.Form";

export const AddGroup = () => {
  const { store, selectedGroup, setSelectedGroup, setStoreProperties } =
    useChromeStore(useMockStoreSelector);

  return (
    <SideDrawer minWidth={480}>
      <AddGroupForm
        key={`${selectedGroup.id}`}
        store={store}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        setStoreProperties={setStoreProperties}
      />
    </SideDrawer>
  );
};
