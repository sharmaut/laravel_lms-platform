import { useState, useEffect } from 'react';
import apiClient from '../services/api';
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';

// The component now accepts `resourceToEdit` and `onResourceUpdated` props
const AddResourceForm = ({ open, onClose, onResourceAdded, resourceToEdit, onResourceUpdated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);

  // This effect fills the form when a resource is passed in for editing
  useEffect(() => {
    if (resourceToEdit) {
      setTitle(resourceToEdit.title);
      setDescription(resourceToEdit.description);
      setLink(resourceToEdit.link);
      setCategoryId(resourceToEdit.category_id);
    } else {
      // Clear form when opening for a new resource
      setTitle('');
      setDescription('');
      setLink('');
      setCategoryId('');
    }
  }, [resourceToEdit, open]);

  // Fetch categories for the dropdown menu
  useEffect(() => {
    if (open) {
      apiClient.get('/categories').then(response => {
        setCategories(response.data.data);
      });
    }
  }, [open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const resourceData = { title, description, link, category_id: categoryId };

    try {
      if (resourceToEdit) {
        const response = await apiClient.put(`/resources/${resourceToEdit.id}`, resourceData);
        onResourceUpdated(response.data.data);
      } else {
        const response = await apiClient.post('/resources', resourceData);
        onResourceAdded(response.data.data);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save resource:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      {/* Change title based on whether we are editing or adding */}
      <DialogTitle>{resourceToEdit ? 'Edit Resource' : 'Add New Resource'}</DialogTitle>
      <DialogContent>
        <TextField autoFocus margin="dense" label="Title" type="text" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextField margin="dense" label="Description" type="text" fullWidth multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
        <TextField margin="dense" label="Link" type="url" fullWidth value={link} onChange={(e) => setLink(e.target.value)} />
        <FormControl fullWidth margin="dense">
          <InputLabel>Category</InputLabel>
          <Select value={categoryId} label="Category" onChange={(e) => setCategoryId(e.target.value)}>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">{resourceToEdit ? 'Save Changes' : 'Add'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddResourceForm;