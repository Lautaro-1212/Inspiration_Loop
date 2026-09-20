import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  ActivityIndicator, 
  StyleSheet, 
  RefreshControl,
  Dimensions
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');
// Calculamos el ancho de cada tarjeta para 2 columnas con márgenes
const CARD_WIDTH = (width - 48) / 2;

// --- COMPONENTE RENDER TARJETA (ESTILO MVP) ---
function RenderTarjeta({ item, index }) {
  const imageUri = item.imageUrl || item.image || item.uri;

  // Variamos la altura entre elementos pares e impares para simular el efecto Masonry/intercalado
  const cardHeight = index % 2 === 0 ? 180 : 240;

  return (
    <View style={styles.cardWrapper}>
      <View style={[styles.cardContainer, { height: cardHeight }]}>
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
      </View>
      {/* Título debajo de la tarjeta */}
      <Text style={styles.cardTitle} numberOfLines={1}>
        {item.name || item.nombre || `Imagen${index + 1}`}
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  const [tarjetas, setTarjetas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  if (cargando) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FFF" />
        <Text style={styles.loadingText}>Cargando imágenes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tarjetas}
        keyExtractor={(item, index) => item.id?.toString() || item._id?.toString() || index.toString()}
        renderItem={({ item, index }) => <RenderTarjeta item={item} index={index} />}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6c7383', // Tono gris/azulado similar al fondo de la maqueta
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

  // ESTILOS NUEVOS BASADOS EN EL MVP
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
});