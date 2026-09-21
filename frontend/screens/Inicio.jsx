import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  ActivityIndicator, 
  StyleSheet, 
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  Modal,
  ScrollView
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

// --- COMPONENTE RENDER TARJETA ---
function RenderTarjeta({ item, index, onSelectImage }) {
  const imageUri = item.imageUrl || item.image || item.uri;
  const cardHeight = index % 2 === 0 ? 180 : 240;

  return (
    <View style={styles.cardWrapper}>
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => onSelectImage(item)}
        style={[styles.cardContainer, { height: cardHeight }]}
      >
        {imageUri ? (
          <Image 
            source={{ uri: imageUri }} 
            style={styles.cardImage} 
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noImageContainer}>
            <Text style={styles.noImageText}>Sin Imagen</Text>
          </View>
        )}
      </TouchableOpacity>
      
      {/* Título debajo de la tarjeta */}
      <Text style={styles.cardTitle} numberOfLines={1}>
        {item.name || item.nombre || `Imagen ${index + 1}`}
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  const [tarjetas, setTarjetas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Guardamos todo el objeto de la tarjeta seleccionada
  const [modalVisible, setModalVisible] = useState(false);
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState(null);

  const API_URL = 'http://localhost:3000/api/images/random';
  const SERVER_BASE_URL = 'http://localhost:3000'; 

  const obtenerImagenes = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (response.ok && data.mensaje) {
        const tarjetasFormateadas = data.mensaje.map((item) => {
          const filename = item.path ? item.path.split(/[/\\]/).pop() : '';
          const urlFinal = filename ? `${SERVER_BASE_URL}/uploads/images/${filename}` : null;
          
          return {
            ...item,
            imageUrl: urlFinal
          };
        });

        setTarjetas(tarjetasFormateadas);
      } else {
        console.error('Error al obtener imágenes:', data.error);
      }
    } catch (error) {
      console.error('Error de red al consultar el endpoint:', error);
    } finally {
      setCargando(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      obtenerImagenes();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    obtenerImagenes();
  };

  const abrirTarjeta = (item) => {
    setTarjetaSeleccionada(item);
    setModalVisible(true);
  };

  // Normalizador de categorías para admitir arrays o strings JSON parseados
  const obtenerCategorias = (item) => {
    if (!item?.categories && !item?.categoria) return [];
    const cat = item.categories || item.categoria;
    if (Array.isArray(cat)) return cat;
    try {
      return JSON.parse(cat);
    } catch {
      return [cat];
    }
  };

  if (cargando) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FFF" />
        <Text style={styles.loadingText}>Cargando imágenes...</Text>
      </View>
    );
  }

  const imageUriModal = tarjetaSeleccionada?.imageUrl || tarjetaSeleccionada?.image || tarjetaSeleccionada?.uri;
  const listaCategorias = tarjetaSeleccionada ? obtenerCategorias(tarjetaSeleccionada) : [];

  return (
    <View style={styles.container}>
      <FlatList
        data={tarjetas}
        keyExtractor={(item, index) => item.id?.toString() || item._id?.toString() || index.toString()}
        renderItem={({ item, index }) => (
          <RenderTarjeta 
            item={item} 
            index={index} 
            onSelectImage={abrirTarjeta} 
          />
        )}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listPadding}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#28a745']} />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No hay imágenes registradas aún.</Text>
          </View>
        }
      />

      {/* MODAL DETALLADO */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity 
            onPress={() => setModalVisible(false)}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}> ✕ Cerrar </Text>
          </TouchableOpacity>

          {tarjetaSeleccionada && (
            <ScrollView 
              contentContainerStyle={styles.modalScrollContent} 
              showsVerticalScrollIndicator={false}
            >
              {/* Imagen principal */}
              {imageUriModal && (
                <Image 
                  source={{ uri: imageUriModal }} 
                  style={styles.fullImage} 
                  resizeMode="contain"
                />
              )}

              {/* Contenedor de información debajo de la imagen */}
              <View style={styles.modalInfoContainer}>
                {/* Nombre */}
                <Text style={styles.modalTitle}>
                  {tarjetaSeleccionada.name || tarjetaSeleccionada.nombre || 'Sin título'}
                </Text>

                {/* Lista de Categorías */}
                {listaCategorias.length > 0 && (
                  <View style={styles.categoriesWrapper}>
                    {listaCategorias.map((cat, idx) => (
                      <View key={idx} style={styles.categoryBadge}>
                        <Text style={styles.categoryBadgeText}>{cat}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Descripción */}
                <Text style={styles.modalDescription}>
                  {tarjetaSeleccionada.description || tarjetaSeleccionada.descripcion || 'Sin descripción disponible.'}
                </Text>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6c7383',
  },
  listPadding: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  loadingText: {
    color: '#FFF',
    marginTop: 10,
    fontSize: 16,
  },
  emptyText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  cardWrapper: {
    width: CARD_WIDTH,
  },
  cardContainer: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  noImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  noImageText: {
    color: '#888',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '400',
    color: '#000',
    marginTop: 6,
    marginLeft: 2,
  },

  // ESTILOS PARA EL MODAL CON INFORMACIÓN DETALLADA
modalBackground: {
  flex: 1,
  backgroundColor: '#FFFFFF', // Fondo blanco
},
modalScrollContent: {
  alignItems: 'center',
  justifyContent: 'center', // Centra todo verticalmente
  paddingVertical: 40,
  paddingHorizontal: 20,
  marginTop:150
},
closeButton: {
  position: 'absolute',
  top: 40,
  right: 20,
  zIndex: 10,
  padding: 10,
  backgroundColor: 'rgba(0, 0, 0, 0.1)', // Fondo gris traslúcido
  borderRadius: 20,
},
closeButtonText: {
  color: '#000000', // Texto negro
  fontWeight: 'bold',
  fontSize: 18,
},
  fullImage: {
    width: width * 0.85,
    height: 350,
    borderRadius: 12,
  },
  modalInfoContainer: {
    width: width * 0.85,
    marginTop: 20,
    alignItems: 'flex-start',
  },
  modalTitle: {
  color: '#000000', // Texto negro
  fontSize: 22,
  fontWeight: 'bold',
  marginBottom: 10,
},
  categoriesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  categoryBadge: {
  backgroundColor: '#E0E0E0', // Fondo gris claro
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 6,
  marginRight: 6,
  marginBottom: 6,
  borderWidth: 1,
  borderColor: '#CCC',
},
categoryBadgeText: {
  color: '#000000', // Texto negro
  fontSize: 13,
  fontWeight: '600',
},
 modalDescription: {
  color: '#333333', // Texto gris oscuro/negro
  fontSize: 15,
  lineHeight: 22,
},
});