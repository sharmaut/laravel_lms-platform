import { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { Box, Card, CardActions, CardContent, Typography, CircularProgress, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import AddResourceForm from '../components/AddResourceForm';

const ResourcePage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null); // <-- State for the resource being edited

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/resources');
      setResources(response.data.data);
    } catch (error) {
      console.error("Failed to fetch resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResourceAdded = (newResource) => {
    setResources(prevResources => [newResource, ...prevResources]);
  };

  const handleResourceUpdated = (updatedResource) => {
    setResources(prevResources => prevResources.map(res => 
      res.id === updatedResource.id ? updatedResource : res
    ));
  };
  
  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/resources/${id}`);
      setResources(prevResources => prevResources.filter(resource => resource.id !== id));
    } catch(error) {
      console.error("Failed to delete resource:", error);
    }
  };

  // Handlers for opening the form for editing or adding
  const handleEditClick = (resource) => {
    setEditingResource(resource);
    setFormOpen(true);
  };

  const handleAddClick = () => {
    setEditingResource(null);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingResource(null);
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Learning Resources</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddClick}>Add Resource</Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {resources.map((resource) => (
          <Card key={resource.id} sx={{ minWidth: 275, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <CardContent>
              <Typography variant="h5" component="div">{resource.title}</Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                <a href={resource.link} target="_blank" rel="noopener noreferrer">Go to resource</a>
              </Typography>
              <Typography variant="body2">{resource.description}</Typography>
            </CardContent>
            <CardActions>
              <IconButton size="small" onClick={() => handleEditClick(resource)}><EditIcon /></IconButton>
              <IconButton size="small" onClick={() => handleDelete(resource.id)}><DeleteIcon /></IconButton>
            </CardActions>
          </Card>
        ))}
      </Box>

      <AddResourceForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onResourceAdded={handleResourceAdded}
        onResourceUpdated={handleResourceUpdated}
        resourceToEdit={editingResource}
      />
    </Box>
  );
};

export default ResourcePage;